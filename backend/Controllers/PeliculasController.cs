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

    // GET: api/Peliculas
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Pelicula>>> GetPeliculas()
    {
        return await _context.Peliculas.ToListAsync();
    }

    // POST: api/Peliculas
    [HttpPost]
    public async Task<ActionResult<Pelicula>> PostPelicula(Pelicula pelicula)
    {
        _context.Peliculas.Add(pelicula);
        await _context.SaveChangesAsync();
        return Ok(pelicula);
    }
}