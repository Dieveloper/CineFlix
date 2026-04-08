using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

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
}