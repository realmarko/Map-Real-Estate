using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplication2.Models;

namespace WebApplication2.Controllers
{
    public class PropiedadController : Controller
    {
        // GET: Propiedad
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GuardarPropiedad(Propiedad propiedad)
        {

            return Json(null, JsonRequestBehavior.AllowGet);
        }


    }
}