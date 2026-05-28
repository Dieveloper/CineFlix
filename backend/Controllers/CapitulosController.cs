using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CapitulosController : ControllerBase
{
    private readonly CineContext _context;

    public CapitulosController(CineContext context)
    {
        _context = context;
    }

    // Obtener capítulos de una serie
    [HttpGet("serie/{serieId}")]
    public async Task<ActionResult<IEnumerable<Capitulo>>> GetCapitulos(int serieId)
    {
        return await _context.Capitulos
            .Where(c => c.SerieId == serieId)
            .OrderBy(c => c.Numero)
            .ToListAsync();
    }

    // Crear capítulo
    [HttpPost]
    public async Task<ActionResult<Capitulo>> PostCapitulo(Capitulo capitulo)
    {
        capitulo.VideoUrl = capitulo.VideoUrl ?? string.Empty;
        capitulo.ImagenUrl = capitulo.ImagenUrl ?? string.Empty;
        _context.Capitulos.Add(capitulo);
        await _context.SaveChangesAsync();
        return Ok(capitulo);
    }

    // Eliminar capítulo
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCapitulo(int id)
    {
        var capitulo = await _context.Capitulos.FindAsync(id);
        if (capitulo == null) return NotFound();

        if (!string.IsNullOrEmpty(capitulo.VideoUrl))
        {
            string ruta = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", capitulo.VideoUrl.TrimStart('/'));
            if (System.IO.File.Exists(ruta)) System.IO.File.Delete(ruta);
        }

        if (!string.IsNullOrEmpty(capitulo.ImagenUrl))
        {
            string ruta = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", capitulo.ImagenUrl.TrimStart('/'));
            if (System.IO.File.Exists(ruta)) System.IO.File.Delete(ruta);
        }

        _context.Capitulos.Remove(capitulo);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // Subir portada del capítulo
    [HttpPost("{id}/upload-portada")]
    public async Task<IActionResult> SubirPortada([FromRoute] int id, [FromForm] SubirCapituloDto dto)
    {
        if (dto.Archivo == null || dto.Archivo.Length == 0)
            return BadRequest("No se ha enviado ningún archivo.");

        var capitulo = await _context.Capitulos.FindAsync(id);
        if (capitulo == null) return NotFound();

        string carpeta = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "series", "portadas");
        if (!Directory.Exists(carpeta)) Directory.CreateDirectory(carpeta);

        if (!string.IsNullOrEmpty(capitulo.ImagenUrl))
        {
            string vieja = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", capitulo.ImagenUrl.TrimStart('/'));
            if (System.IO.File.Exists(vieja)) System.IO.File.Delete(vieja);
        }

        string fileName = $"{Guid.NewGuid()}{Path.GetExtension(dto.Archivo.FileName)}";
        string rutaCompleta = Path.Combine(carpeta, fileName);

        using (var stream = new FileStream(rutaCompleta, FileMode.Create))
        {
            await dto.Archivo.CopyToAsync(stream);
        }

        capitulo.ImagenUrl = $"/series/portadas/{fileName}";
        await _context.SaveChangesAsync();

        return Ok(new { url = capitulo.ImagenUrl });
    }

    // Subir vídeo del capítulo
    [HttpPost("{id}/upload-video")]
    public async Task<IActionResult> SubirVideo([FromRoute] int id, [FromForm] SubirCapituloDto dto)
    {
        if (dto.Archivo == null || dto.Archivo.Length == 0)
            return BadRequest("No se ha enviado ningún archivo.");

        var capitulo = await _context.Capitulos.FindAsync(id);
        if (capitulo == null) return NotFound();

        string carpeta = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "series", "videos");
        if (!Directory.Exists(carpeta)) Directory.CreateDirectory(carpeta);

        if (!string.IsNullOrEmpty(capitulo.VideoUrl))
        {
            string vieja = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", capitulo.VideoUrl.TrimStart('/'));
            if (System.IO.File.Exists(vieja)) System.IO.File.Delete(vieja);
        }

        string fileName = $"{Guid.NewGuid()}{Path.GetExtension(dto.Archivo.FileName)}";
        string rutaCompleta = Path.Combine(carpeta, fileName);

        using (var stream = new FileStream(rutaCompleta, FileMode.Create))
        {
            await dto.Archivo.CopyToAsync(stream);
        }

        capitulo.VideoUrl = $"/series/videos/{fileName}";
        await _context.SaveChangesAsync();

        return Ok(new { url = capitulo.VideoUrl });
    }
}

public class SubirCapituloDto
{
    public IFormFile Archivo { get; set; } = null!;
}