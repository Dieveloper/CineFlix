public class CambioFotoDto
{
    public int PerfilId { get; set; }
    public IFormFile Archivo { get; set; } = null!;
}