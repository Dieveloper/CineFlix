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
    
    // Esto es un ENDPOINT GET para obtener una serie específica
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

    // Esto es un ENDPOINT GET para obtener todas las series
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Serie>>> GetSeries()
    {
        return await _context.Series.ToListAsync();
    }

    // ESTO ES UN ENDPOINT POST PARA AGREGAR UNA NUEVA SERIE
    [HttpPost]
    public async Task<ActionResult<Serie>> PostSerie(Serie serie)
    {
        _context.Series.Add(serie);
        await _context.SaveChangesAsync();
        return Ok(serie);
    }
}