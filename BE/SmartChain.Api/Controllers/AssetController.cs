using ErrorOr;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;

namespace SmartChain.Api.Controllers
{
    [ApiController]
    [Route("api/asset")]
    public class AssetController : ApiController
    {
        private readonly string _uploadPath;

        public AssetController()
        {
            _uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            if (!Directory.Exists(_uploadPath))
            {
                Directory.CreateDirectory(_uploadPath);
            }
        }

        [HttpPost("upload-image")]
        public async Task<IActionResult> UploadImage([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return Problem(new List<Error> { Error.Validation("File.Empty", "Bạn chưa chọn file.") });
            }

            try
            {
                var fileName = Path.GetRandomFileName() + Path.GetExtension(file.FileName);
                var filePath = Path.Combine(_uploadPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                return Ok(new { fileName = fileName });
            }
            catch (Exception)
            {
                return Problem(new List<Error> { Error.Failure("System.Error", "Hệ thống gặp sự cố.") });
            }
        }

        [HttpGet("view-image/{fileName}")]
        public IActionResult ViewImage(string fileName)
        {
            try
            {
                var filePath = Path.Combine(_uploadPath, fileName);

                if (!System.IO.File.Exists(filePath))
                {
                    return Problem(new List<Error> { Error.NotFound("File.NotFound", "Không tìm thấy hình ảnh.") });
                }

                var fileExtension = Path.GetExtension(fileName).ToLower();
                string contentType = fileExtension switch
                {
                    ".jpg" or ".jpeg" => "image/jpeg",
                    ".png" => "image/png",
                    ".gif" => "image/gif",
                    ".bmp" => "image/bmp",
                    _ => "application/octet-stream"
                };

                var fileBytes = System.IO.File.ReadAllBytes(filePath);
                return File(fileBytes, contentType);
            }
            catch (Exception)
            {
                return Problem(new List<Error> { Error.Failure("System.Error", "Hệ thống gặp sự cố.") });
            }
        }
    }
}