using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

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
            // Cambiado a _context.Perfil
            return await _context.Perfil
                .Where(p => p.UsuarioId == usuarioId)
                .ToListAsync();
        }

        // 2. Crear un nuevo perfil
        [HttpPost]
        public async Task<ActionResult<Perfil>> PostPerfil(CrearPerfilDto dto)
        {
            // Creamos el objeto real de la base de datos a partir del DTO
            var nuevoPerfil = new Perfil
            {
                Nombre = dto.Nombre,
                UsuarioId = dto.UsuarioId,
                FotoUrl = dto.FotoUrl // Usar la foto proporcionada o null
            };

            _context.Perfil.Add(nuevoPerfil);
            await _context.SaveChangesAsync();

            // Importante: Devolvemos el perfil creado
            return CreatedAtAction(nameof(GetPerfiles), new { usuarioId = nuevoPerfil.UsuarioId }, nuevoPerfil);
        }

        // 3. CAMBIAR O SUBIR FOTO DEL PERFIL
        [HttpPut("update-photo")]
        public async Task<IActionResult> ActualizarFoto([FromForm] CambioFotoDto dto)
        {
            // Cambiado a _context.Perfil
            var perfil = await _context.Perfil.FindAsync(dto.PerfilId);
            if (perfil == null) return NotFound("El perfil no existe.");

            if (dto.Archivo != null && dto.Archivo.Length > 0)
            {
                string folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/perfiles");
                if (!Directory.Exists(folderPath)) Directory.CreateDirectory(folderPath);

                if (!string.IsNullOrEmpty(perfil.FotoUrl))
                {
                    string viejaRuta = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", perfil.FotoUrl.TrimStart('/'));
                    if (System.IO.File.Exists(viejaRuta)) System.IO.File.Delete(viejaRuta);
                }

                string fileName = $"{Guid.NewGuid()}{Path.GetExtension(dto.Archivo.FileName)}";
                string fullPath = Path.Combine(folderPath, fileName);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await dto.Archivo.CopyToAsync(stream);
                }

                perfil.FotoUrl = $"/perfiles/{fileName}";
                await _context.SaveChangesAsync();
                
                return Ok(new { url = perfil.FotoUrl });
            }

            return BadRequest("No se proporcionó ningún archivo.");
        }

        // 4. Eliminar un perfil y su foto
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePerfil(int id)
        {
            // Cambiado a _context.Perfil
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

        // 5. Actualizar perfil completo (nombre y foto)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPerfil(int id, ActualizarPerfilDto dto)
        {
            var perfil = await _context.Perfil.FindAsync(id);
            if (perfil == null) return NotFound("El perfil no existe.");

            // Actualizar nombre
            if (!string.IsNullOrEmpty(dto.Nombre))
            {
                perfil.Nombre = dto.Nombre;
            }

            // Actualizar foto si se proporciona una nueva
            if (!string.IsNullOrEmpty(dto.FotoUrl))
            {
                perfil.FotoUrl = dto.FotoUrl;
            }

            await _context.SaveChangesAsync();

            return Ok(perfil);
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
}