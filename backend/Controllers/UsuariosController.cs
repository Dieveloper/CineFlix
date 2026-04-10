using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsuariosController : ControllerBase
{
    private readonly CineContext _context;

    public UsuariosController (CineContext context)
    {
        _context = context;
    }


    // ESTO ES UN ENDPOINT POST PARA AGREGAR UNA NUEVO USUARIO
    [HttpPost]
    public async Task<ActionResult<Usuarios>> PostUsuario(Usuarios usuario)
    {
        _context.Usuarios.Add(usuario); 

        await _context.SaveChangesAsync();  

        return Ok(usuario);
    }


    // ESTO ES UN ENDPOINT GET PARA LISTAR A LOS USUARIOS
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Usuarios>>> GetUsuarios()
    {
        return await _context.Usuarios.ToListAsync();
    }


   

}