using Microsoft.AspNetCore.Mvc;

namespace CareerTinder.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}