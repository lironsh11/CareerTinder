namespace CareerTinder.Models
{
    public class Job
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Company { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Salary { get; set; } = string.Empty;
        public List<string> Tags { get; set; } = new List<string>();
        public string LogoUrl { get; set; } = string.Empty;
    }
}