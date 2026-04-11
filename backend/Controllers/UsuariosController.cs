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
    [HttpPost("register")]
public async Task<ActionResult<Usuarios>> Register(registerRequest datos)
{
    var existe = await _context.Usuarios.AnyAsync(u => u.email == datos.email);
    if (existe)
    {
        return BadRequest("El email ya está registrado.");
    }

    var nuevoUsuario = new Usuarios
    {
        Nombre = datos.Nombre,
        email = datos.email,
        Password = datos.Password
        
    };

    _context.Usuarios.Add(nuevoUsuario);
    await _context.SaveChangesAsync();

    return Ok(nuevoUsuario);
}


    // ESTO ES UN ENDPOINT GET PARA LISTAR A LOS USUARIOS
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Usuarios>>> GetUsuarios()
    {
        return await _context.Usuarios.ToListAsync();
    }
    
    // ESTO ES UN ENDPOINT POST PARA INICIAR SESION
    [HttpPost("login")]
    public async Task<ActionResult> Login([FromBody] LoginRequest loginData)
    {
        
        var usuario = await _context.Usuarios
            .Include(u => u.Perfiles) 
            .FirstOrDefaultAsync(u => u.email == loginData.Email);

        
        if (usuario == null || usuario.Password != loginData.Password)
        {
            return Unauthorized("Credenciales incorrectas");
        }

        
        return Ok(new { 
            mensaje = "Login exitoso", 
            id = usuario.Id,
            nombre = usuario.Nombre,
            perfiles = usuario.Perfiles
        });
    }

   

}