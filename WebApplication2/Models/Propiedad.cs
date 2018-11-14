using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebApplication2.Models
{
    public class Propiedad
    {
        [Required]
        public string TituloPrincipal { get; set; }
        [Required]
        public double Precio { get; set; }

        public string Coordx { get; set; }
        public string CoordY { get; set; }
    }
}