using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using System.IO;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PerfilesController : ControllerBase
    {
        private readonly CineContext _context;

        public PerfilesController(CineContext context)
        {
            _context = context;
        }

        // 1. Obtener perfiles de un usuario específico
        [HttpGet("usuario/{usuarioId}")]
        public async Task<ActionResult<IEnumerable<Perfil>>> GetPerfiles(int usuarioId)
        {
            return await _context.Perfil
                .Where(p => p.UsuarioId == usuarioId)
                .ToListAsync();
        }

        // 2. Crear un nuevo perfil
        [HttpPost]
        public async Task<ActionResult<Perfil>> PostPerfil(CrearPerfilDto dto)
        {
            var nuevoPerfil = new Perfil
            {
                Nombre = dto.Nombre,
                UsuarioId = dto.UsuarioId,
                FotoUrl = dto.FotoUrl
            };

            _context.Perfil.Add(nuevoPerfil);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPerfiles), new { usuarioId = nuevoPerfil.UsuarioId }, nuevoPerfil);
        }

        // 3. Eliminar un perfil y su foto
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePerfil(int id)
        {
            var perfil = await _context.Perfil.FindAsync(id);
            if (perfil == null) return NotFound();

            if (!string.IsNullOrEmpty(perfil.FotoUrl))
            {
                string ruta = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", perfil.FotoUrl.TrimStart('/'));
                if (System.IO.File.Exists(ruta)) System.IO.File.Delete(ruta);
            }

            _context.Perfil.Remove(perfil);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // 4. Actualizar perfil completo (nombre y foto)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPerfil(int id, ActualizarPerfilDto dto)
        {
            var perfil = await _context.Perfil.FindAsync(id);
            if (perfil == null) return NotFound("El perfil no existe.");

            if (!string.IsNullOrEmpty(dto.Nombre))
                perfil.Nombre = dto.Nombre;

            if (!string.IsNullOrEmpty(dto.FotoUrl))
                perfil.FotoUrl = dto.FotoUrl;

            await _context.SaveChangesAsync();

            return Ok(perfil);
        }

        // 5. Obtener lista de avatares disponibles
        [HttpGet("avatares")]
        public IActionResult GetAvatares()
        {
            string folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "avatares");

            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            var archivos = Directory.GetFiles(folderPath)
                .Select(f => $"/avatares/{Path.GetFileName(f)}")
                .ToList();

            return Ok(archivos);
        }

        // 6. Subir un nuevo avatar
        [HttpPost("upload-avatar")]
        public async Task<IActionResult> SubirAvatar([FromForm] SubirAvatarDto dto)
        {
            if (dto.Archivo == null || dto.Archivo.Length == 0)
                return BadRequest("No se proporcionó ningún archivo.");

            string folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "avatares");
            if (!Directory.Exists(folderPath)) Directory.CreateDirectory(folderPath);

            string fileName = $"{Guid.NewGuid()}{Path.GetExtension(dto.Archivo.FileName)}";
            string fullPath = Path.Combine(folderPath, fileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await dto.Archivo.CopyToAsync(stream);
            }

            return Ok(new { url = $"/avatares/{fileName}" });
        }

        // 7. Eliminar un avatar
        [HttpDelete("eliminar-avatar")]
        public IActionResult EliminarAvatar([FromBody] EliminarAvatarDto dto)
        {
            string ruta = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", dto.Url.TrimStart('/'));
            if (System.IO.File.Exists(ruta))
            {
                System.IO.File.Delete(ruta);
                return Ok(new { mensaje = "Avatar eliminado." });
            }
            return NotFound("El archivo no existe.");
        }

        public class EliminarAvatarDto
        {
            public string Url { get; set; } = string.Empty;
        }
    }

    public class CambioFotoDto
    {
        public int PerfilId { get; set; }
        public IFormFile Archivo { get; set; } = null!;
    }

    public class CrearPerfilDto
    {
        public string Nombre { get; set; } = string.Empty;
        public int UsuarioId { get; set; }
        public string? FotoUrl { get; set; }
    }

    public class ActualizarPerfilDto
    {
        public string? Nombre { get; set; }
        public string? FotoUrl { get; set; }
    }

    public class SubirAvatarDto
    {
        public IFormFile Archivo { get; set; } = null!;
    }
}