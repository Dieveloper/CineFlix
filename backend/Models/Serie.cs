namespace backend.Models;

public class Serie
{
   public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Creador { get; set; } = string.Empty;
    public string Sinopsis { get; set; } = string.Empty;
    public int Anio { get; set; }
}