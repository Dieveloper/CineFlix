using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]

public class SeriesController : ControllerBase
{
    private readonly CineContext _context;

    public SeriesController(CineContext context)
    {
        _context = context;
    }
    
    [HttpGet("{id}")]
 
    public async Task<ActionResult<Serie>> GetSerie(int id)
    {
        var serie = await _context.Series.FindAsync(id);
        if (serie == null)
        {
            return NotFound();
        }
        return Ok(serie);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Serie>>> GetSeries()
    {
        return await _context.Series.ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Serie>> PostSerie(Serie serie)
    {
        _context.Series.Add(serie);
        await _context.SaveChangesAsync();
        return Ok(serie);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<Serie>> DeleteSerie(int id)
    {
        var serie = await _context.Series.FindAsync(id);

        if(serie == null )
        {
            return NotFound();
        }
        _context.Series.Remove(serie);
        await _context.SaveChangesAsync();
        return Ok(serie);
    }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> EditSerie(int id, Serie serieActualizada)
    {
        if (id != serieActualizada.Id)
        {
            return BadRequest("El ID de la serie no coincide.");
        }

        _context.Entry(serieActualizada).State = EntityState.Modified;
        
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Series.Any(s => s.Id == id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return Ok(serieActualizada);
    }

    [HttpPost("{id}/upload-portada")]
    public async Task<IActionResult> SubirPortada([FromRoute] int id, [FromForm] SubirSerieDto dto)
    {
        if (dto.Archivo == null || dto.Archivo.Length == 0)
            return BadRequest("No se ha enviado ningún archivo.");

        var serie = await _context.Series.FindAsync(id);
        if (serie == null) return NotFound();

        string carpeta = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "series", "portadas");
        if (!Directory.Exists(carpeta)) Directory.CreateDirectory(carpeta);

        if (!string.IsNullOrEmpty(serie.ImagenUrl))
        {
            string vieja = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", serie.ImagenUrl.TrimStart('/'));
            if (System.IO.File.Exists(vieja)) System.IO.File.Delete(vieja);
        }

        string fileName = $"{Guid.NewGuid()}{Path.GetExtension(dto.Archivo.FileName)}";
        string rutaCompleta = Path.Combine(carpeta, fileName);

        using (var stream = new FileStream(rutaCompleta, FileMode.Create))
        {
            await dto.Archivo.CopyToAsync(stream);
        }

        serie.ImagenUrl = $"/series/portadas/{fileName}";
        await _context.SaveChangesAsync();

        return Ok(new { url = serie.ImagenUrl });
    }
}

public class SubirSerieDto
{
    public IFormFile Archivo { get; set; } = null!;
}