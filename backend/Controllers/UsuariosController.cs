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

    // ENDPOINT POST PARA AGREGAR UN NUEVO USUARIO
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

    // ENDPOINT GET PARA LISTAR A LOS USUARIOS
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Usuarios>>> GetUsuarios()
    {
        return await _context.Usuarios.ToListAsync();
    }
    
    // ENDPOINT POST PARA INICIAR SESION
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

        // Corregido: Quitamos la propiedad 'EsAdmin' ya que tu modelo no la maneja actualmente
        return Ok(new { 
            mensaje = "Login exitoso", 
            id = usuario.Id,
            nombre = usuario.Nombre,
            perfiles = usuario.Perfiles
        });
    }

    // ENDPOINT PUT PARA ACTUALIZAR UN USUARIO EXISTENTE
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateUsuario(int id, [FromBody] registerRequest datosActualizados)
    {
        var usuario = await _context.Usuarios.FindAsync(id);
        
        if (usuario == null)
        {
            return NotFound($"No se encontró ningún usuario con el ID {id}.");
        }

        var emailDuplicado = await _context.Usuarios.AnyAsync(u => u.email == datosActualizados.email && u.Id != id);
        if (emailDuplicado)
        {
            return BadRequest("El email ya está registrado por otro usuario.");
        }

        usuario.Nombre = datosActualizados.Nombre;
        usuario.email = datosActualizados.email;
        usuario.Password = datosActualizados.Password;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            return StatusCode(500, "Error de concurrencia al actualizar el usuario.");
        }

        return Ok(new { mensaje = "Usuario actualizado con éxito", usuario });
    }

    // ENDPOINT DELETE PARA ELIMINAR UN USUARIO
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteUsuario(int id)
    {
        var usuario = await _context.Usuarios.FindAsync(id);
        
        if (usuario == null)
        {
            return NotFound($"No se encontró ningún usuario con el ID {id}.");
        }

        _context.Usuarios.Remove(usuario);
        await _context.SaveChangesAsync();

        return Ok(new { mensaje = $"Usuario con ID {id} eliminado correctamente." });
    }
}