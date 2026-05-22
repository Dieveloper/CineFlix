using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using System.IO; // Necesario para Path, Directory y File

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PeliculasController : ControllerBase
{
    private readonly CineContext _context;

    public PeliculasController(CineContext context)
    {
        _context = context;
    }
    
    // Esto es un ENDPOINT GET para obtener una película específica
    [HttpGet("{id}")]
    public async Task<ActionResult<Pelicula>> GetPelicula(int id)
    {
        var pelicula = await _context.Peliculas.FindAsync(id);
        if (pelicula == null)
        {
            return NotFound();
        }
        return Ok(pelicula);
    }

    // Esto es un ENDPOINT GET para obtener todas las películas
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Pelicula>>> GetPeliculas()
    {
        return await _context.Peliculas.ToListAsync();
    }

    // ESTO ES UN ENDPOINT POST PARA AGREGAR UNA NUEVA PELÍCULA
    [HttpPost]
    public async Task<ActionResult<Pelicula>> PostPelicula(Pelicula pelicula)
    {
        _context.Peliculas.Add(pelicula);
        await _context.SaveChangesAsync();
        return Ok(pelicula);
    }

    // ESTO ES UN ENDPOINT DELETE PARA ELIMINAR UNA PELÍCULA Y SUS ARCHIVOS ASOCIADOS
    [HttpDelete("{id}")]
    public async Task<ActionResult<Pelicula>> DeletePelicula(int id)
    {
        var pelicula = await _context.Peliculas.FindAsync(id);

        if (pelicula == null)
        {
            return NotFound();
        }

        // Borramos la imagen del servidor si existe para no dejar basura
        if (!string.IsNullOrEmpty(pelicula.ImagernUrl))
        {
            string rutaImagen = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", pelicula.ImagernUrl.TrimStart('/'));
            if (System.IO.File.Exists(rutaImagen)) System.IO.File.Delete(rutaImagen);
        }

        // Borramos el vídeo del servidor si existe
        if (!string.IsNullOrEmpty(pelicula.VideoUrl))
        {
            string rutaVideo = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", pelicula.VideoUrl.TrimStart('/'));
            if (System.IO.File.Exists(rutaVideo)) System.IO.File.Delete(rutaVideo);
        }

        _context.Peliculas.Remove(pelicula);
        await _context.SaveChangesAsync();
        return Ok(pelicula);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> EditPelicula(int id, Pelicula peliculaActualizada)
    {
        if (id != peliculaActualizada.Id)
        {
            return BadRequest("El ID de la pelicula no coincide.");
        }

        _context.Entry(peliculaActualizada).State = EntityState.Modified;
        
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Peliculas.Any(s => s.Id == id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return Ok(peliculaActualizada);
    }

    // ENDPOINT PARA SUBIR LA PORTADA DE UNA PELÍCULA
    [HttpPost("{id}/upload-portada")]
    public async Task<IActionResult> SubirPortada(int id, [FromForm] IFormFile archivo)
    {
        if (archivo == null || archivo.Length == 0)
        {
            return BadRequest("No se ha enviado ningún archivo válido.");
        }

        var pelicula = await _context.Peliculas.FindAsync(id);
        if (pelicula == null)
        {
            return NotFound($"No se encontró la película con ID {id}.");
        }

        string carpetaDestino = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "peliculas", "portadas");

        if (!Directory.Exists(carpetaDestino))
        {
            Directory.CreateDirectory(carpetaDestino);
        }

        // Si ya tenía una imagen previa, la eliminamos físicamente
        if (!string.IsNullOrEmpty(pelicula.ImagernUrl))
        {
            string viejaRuta = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", pelicula.ImagernUrl.TrimStart('/'));
            if (System.IO.File.Exists(viejaRuta)) System.IO.File.Delete(viejaRuta);
        }

        string extension = Path.GetExtension(archivo.FileName);
        string nombreArchivo = $"{Guid.NewGuid()}{extension}";
        string rutaCompleta = Path.Combine(carpetaDestino, nombreArchivo);

        using (var stream = new FileStream(rutaCompleta, FileMode.Create))
        {
            await archivo.CopyToAsync(stream);
        }

        string urlPublica = $"/peliculas/portadas/{nombreArchivo}";

        // Vinculado con tu propiedad exacta del modelo: ImagernUrl
        pelicula.ImagernUrl = urlPublica; 
        await _context.SaveChangesAsync();

        return Ok(new { mensaje = "Portada subida con éxito", url = urlPublica });
    }

    // ENDPOINT PARA SUBIR EL VÍDEO DE UNA PELÍCULA
    [HttpPost("{id}/upload-video")]
    public async Task<IActionResult> SubirVideo(int id, [FromForm] IFormFile archivo)
    {
        if (archivo == null || archivo.Length == 0)
        {
            return BadRequest("No se ha enviado ningún archivo válido.");
        }

        var pelicula = await _context.Peliculas.FindAsync(id);
        if (pelicula == null)
        {
            return NotFound($"No se encontró la película con ID {id}.");
        }

        string carpetaDestino = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "peliculas", "videos");

        if (!Directory.Exists(carpetaDestino))
        {
            Directory.CreateDirectory(carpetaDestino);
        }

        // Si ya tenía un vídeo previo, lo eliminamos físicamente
        if (!string.IsNullOrEmpty(pelicula.VideoUrl))
        {
            string viejaRuta = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", pelicula.VideoUrl.TrimStart('/'));
            if (System.IO.File.Exists(viejaRuta)) System.IO.File.Delete(viejaRuta);
        }

        string extension = Path.GetExtension(archivo.FileName);
        string nombreArchivo = $"{Guid.NewGuid()}{extension}";
        string rutaCompleta = Path.Combine(carpetaDestino, nombreArchivo);

        using (var stream = new FileStream(rutaCompleta, FileMode.Create))
        {
            await archivo.CopyToAsync(stream);
        }

        string urlPublica = $"/peliculas/videos/{nombreArchivo}";

        // Vinculado con tu propiedad exacta del modelo: VideoUrl
        pelicula.VideoUrl = urlPublica; 
        await _context.SaveChangesAsync();

        return Ok(new { mensaje = "Vídeo subido con éxito", url = urlPublica });
    }
}