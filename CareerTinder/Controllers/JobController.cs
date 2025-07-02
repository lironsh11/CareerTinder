using Microsoft.AspNetCore.Mvc;
using CareerTinder.Models;

namespace CareerTinder.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobController : ControllerBase
    {
        private readonly List<Job> _jobs = new List<Job>
        {
            new Job
            {
                Id = 1,
                Title = "Senior Frontend Developer",
                Company = "TechCorp",
                Description = "Join our dynamic team to build cutting-edge web applications using React, TypeScript, and modern frontend technologies. Work on challenging projects that impact millions of users.",
                Location = "San Francisco, CA",
                Salary = "$120,000 - $160,000",
                Tags = new List<string> { "Remote", "Full-Time", "Senior", "React", "TypeScript" },
                LogoUrl = "https://via.placeholder.com/80x80/4F46E5/FFFFFF?text=TC"
            },
            new Job
            {
                Id = 2,
                Title = "Full Stack Engineer",
                Company = "StartupXYZ",
                Description = "Be part of a fast-growing startup building the next generation of SaaS tools. Work with Node.js, Python, and cloud technologies in an agile environment.",
                Location = "New York, NY",
                Salary = "$100,000 - $140,000",
                Tags = new List<string> { "Hybrid", "Full-Time", "Mid-Level", "Node.js", "Python", "AWS" },
                LogoUrl = "https://via.placeholder.com/80x80/059669/FFFFFF?text=SX"
            },
            new Job
            {
                Id = 3,
                Title = "DevOps Engineer",
                Company = "CloudTech Solutions",
                Description = "Manage and optimize cloud infrastructure, CI/CD pipelines, and containerized applications. Work with Kubernetes, Docker, and major cloud providers.",
                Location = "Austin, TX",
                Salary = "$110,000 - $150,000",
                Tags = new List<string> { "Remote", "Full-Time", "DevOps", "Kubernetes", "Docker", "CI/CD" },
                LogoUrl = "https://via.placeholder.com/80x80/DC2626/FFFFFF?text=CT"
            },
            new Job
            {
                Id = 4,
                Title = "UX/UI Designer",
                Company = "DesignStudio",
                Description = "Create beautiful and intuitive user experiences for web and mobile applications. Collaborate with product teams to design user-centered solutions.",
                Location = "Los Angeles, CA",
                Salary = "$90,000 - $120,000",
                Tags = new List<string> { "Remote", "Full-Time", "Design", "Figma", "Prototyping" },
                LogoUrl = "https://via.placeholder.com/80x80/7C3AED/FFFFFF?text=DS"
            },
            new Job
            {
                Id = 5,
                Title = "Data Scientist",
                Company = "AI Innovations",
                Description = "Apply machine learning and statistical analysis to solve complex business problems. Work with large datasets and build predictive models.",
                Location = "Seattle, WA",
                Salary = "$130,000 - $170,000",
                Tags = new List<string> { "Hybrid", "Full-Time", "Data Science", "Python", "ML", "Senior" },
                LogoUrl = "https://via.placeholder.com/80x80/EA580C/FFFFFF?text=AI"
            },
            new Job
            {
                Id = 6,
                Title = "Product Manager",
                Company = "InnovateCorp",
                Description = "Lead product strategy and development for our flagship products. Work closely with engineering, design, and marketing teams to deliver exceptional user experiences.",
                Location = "Boston, MA",
                Salary = "$115,000 - $145,000",
                Tags = new List<string> { "Remote", "Full-Time", "Product", "Strategy", "Leadership" },
                LogoUrl = "https://via.placeholder.com/80x80/0891B2/FFFFFF?text=IC"
            },
            new Job
            {
                Id = 7,
                Title = "Backend Developer",
                Company = "ScaleTech",
                Description = "Build robust and scalable backend systems using Go, PostgreSQL, and microservices architecture. Focus on performance and reliability.",
                Location = "Chicago, IL",
                Salary = "$105,000 - $140,000",
                Tags = new List<string> { "Remote", "Full-Time", "Backend", "Go", "PostgreSQL", "Microservices" },
                LogoUrl = "https://via.placeholder.com/80x80/16A34A/FFFFFF?text=ST"
            },
            new Job
            {
                Id = 8,
                Title = "Mobile Developer",
                Company = "AppBuilder Inc",
                Description = "Develop native mobile applications for iOS and Android. Work with React Native and native technologies to create smooth user experiences.",
                Location = "Miami, FL",
                Salary = "$95,000 - $130,000",
                Tags = new List<string> { "Hybrid", "Full-Time", "Mobile", "React Native", "iOS", "Android" },
                LogoUrl = "https://via.placeholder.com/80x80/BE185D/FFFFFF?text=AB"
            }
        };

        [HttpGet]
        public ActionResult<IEnumerable<Job>> GetJobs()
        {
            return Ok(_jobs);
        }

        [HttpGet("{id}")]
        public ActionResult<Job> GetJob(int id)
        {
            var job = _jobs.FirstOrDefault(j => j.Id == id);
            if (job == null)
            {
                return NotFound();
            }
            return Ok(job);
        }
    }
}