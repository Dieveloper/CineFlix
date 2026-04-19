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
        public async Task<ActionResult<Perfil>> PostPerfil(Perfil perfil)
        {
            // Cambiado a _context.Perfil
            _context.Perfil.Add(perfil);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetPerfiles), new { usuarioId = perfil.UsuarioId }, perfil);
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
    }

    public class CambioFotoDto
    {
        public int PerfilId { get; set; }
        public IFormFile Archivo { get; set; } = null!;
    }
}