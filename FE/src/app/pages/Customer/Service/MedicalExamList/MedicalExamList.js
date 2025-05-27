import React, { useEffect, useState } from "react";
import SearchIcon from "../../../../assets/icons/icon-search.png";
import Anh from "../../../../assets/images/clinic1.png";
import ExamCard from "../../../../components/Customer/Service/ExamCard"; // Component bạn đã tạo
import { showErrorMessageBox } from "../../../../components/MessageBox/ErrorMessageBox/showErrorMessageBox";
import { showSuccessMessageBox } from "../../../../components/MessageBox/SuccessMessageBox/showSuccessMessageBox";
import { showYesNoMessageBox } from "../../../../components/MessageBox/YesNoMessageBox/showYesNoMessgeBox";
import { fetchGet, fetchPost } from "../../../../lib/httpHandler";
import "./MedicalExamList.css";

export default function MedicalExamList() {
  const [currentPage, setCurrentPage] = useState(1);
  const examsPerPage = 8; // Số lượng ca khám trên mỗi trang
  const [examList, setExamList] = useState([]); // Danh sách ca khám
  const [selectedDay, setSelectedDay] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");

  //Gọi API lấy danh sách ca khám
  useEffect(() => {
    const uri = "/api/cakham/danh-sach-ca-kham-trong-tuan"; // Đường dẫn API
    fetchGet(
      uri,
      (sus) => {
        console.log(sus.data);
        setExamList(sus.data); // Cập nhật danh sách ca khám
      },
      (error) => {
        showErrorMessageBox(error.message);
      },
      () => {
        console.log("Không thể kết nối đến server");
      }
    );
  }, []);

  //Định dạng ngày khám
  function formatDate(dateString) {
    const daysOfWeek = [
      "Chủ nhật",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
    ];

    const date = new Date(dateString);
    const dayOfWeek = daysOfWeek[date.getDay()]; // Lấy thứ trong tuần
    const day = date.getDate().toString().padStart(2, "0"); // Lấy ngày
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Lấy tháng
    const year = date.getFullYear(); // Lấy năm

    return `${dayOfWeek} ngày ${day}/${month}/${year}`;
  }

  // Hàm xử lý khi tìm kiếm
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Hàm xử lý khi thay đổi ngày
  const handleDayChange = (e) => {
    setSelectedDay(e.target.value);
  };
  // Lọc danh sách ca khám
  const filteredExams = examList.filter((exam) => {
    const query = searchQuery.toLowerCase();
    const doctorMatch = (exam.BacSiId?.HoTen || "")
      .toLowerCase()
      .includes(query);

    const daysOfWeek = [
      "Chủ nhật",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
    ];
    const examDate = new Date(exam.NgayKham); // Chuyển ngày khám thành Date object
    const examDay = daysOfWeek[examDate.getDay()]; // Lấy tên ngày từ ngày khám

    const dayMatch = selectedDay === "Tất cả" || examDay === selectedDay;

    return doctorMatch && dayMatch;
  });

  //Đăng ký ca khám
  const registerExam = async (caKhamId) => {
    const result = await showYesNoMessageBox(
      "Bạn có muốn đăng ký ca khám này không?"
    );
    if (!result) return; // Nếu nhấn No hoặc đóng popup thì không gọi API

    const uri = "/api/cakham/dangky";
    const body = { caKhamId };
    fetchPost(
      uri,
      body,
      (sus) => {
        showSuccessMessageBox(sus.message);
      },
      (err) => {
        showErrorMessageBox(err.message);
      },
      () => {
        showErrorMessageBox("Không thể kết nối đến server.");
      }
    );
  };

  // Phân trang
  const indexOfLastExam = currentPage * examsPerPage;
  const indexOfFirstExam = indexOfLastExam - examsPerPage;
  const currentExams = filteredExams.slice(indexOfFirstExam, indexOfLastExam);
  const totalPages = Math.ceil(filteredExams.length / examsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <div className="medical-exam-list-page">
      {/* Phần giới thiệu đăng ký ca khám */}
      <div className="medical-exam-list-section">
        <div className="medical-exam-list-content">
          <h1 className="medical-exam-list-title">Đăng Ký Khám Nhanh Chóng</h1>
          <p className="medical-exam-list-description">
            Tại đây, chúng tôi cung cấp hệ thống đăng ký khám tiện lợi và nhanh
            chóng, giúp bạn dễ dàng chọn lựa dịch vụ y tế phù hợp. Đội ngũ y bác
            sĩ giàu kinh nghiệm và trang thiết bị hiện đại cam kết mang lại chất
            lượng dịch vụ tốt nhất, đảm bảo sức khỏe và sự hài lòng cho bạn và
            gia đình.
          </p>
        </div>
        <div className="medical-exam-list-image">
          <img className="image" src={Anh} alt="Hoạt họa" />
        </div>
      </div>

      {/* Phần danh    */}
      <div className="medical-exam-list-highlight">
        <h2 className="medical-exam-list-highlight-title">
          Danh sách các ca khám đang mở trong tuần
        </h2>
        {/* Tìm kiếm và lọc */}
        <div className="filter-section">
          <div className="search-bar-container">
            <input
              type="text"
              className="search-bar"
              placeholder="Nhập tên bác sĩ để tìm kiếm"
              value={searchQuery} // Liên kết state
              onChange={handleSearchChange} // Gọi hàm khi người dùng nhập
            />
            <img src={SearchIcon} alt="Tìm kiếm" className="search-icon" />
          </div>

          <select
            className="day-filter"
            value={selectedDay}
            onChange={handleDayChange}
          >
            <option value="Tất cả">Tất cả</option>
            <option value="Thứ 2">Thứ 2</option>
            <option value="Thứ 3">Thứ 3</option>
            <option value="Thứ 4">Thứ 4</option>
            <option value="Thứ 5">Thứ 5</option>
            <option value="Thứ 6">Thứ 6</option>
            <option value="Thứ 7">Thứ 7</option>
            <option value="Chủ nhật">Chủ nhật</option>
          </select>
        </div>

        {/* Danh sách các ca khám */}
        <div className="medical-exam-list-grid">
          {currentExams.map((exam) => (
            <ExamCard
              key={exam._id}
              doctorName={
                exam.BacSiId && exam.BacSiId.HoTen
                  ? exam.BacSiId.HoTen
                  : "Chưa rõ"
              }
              starttime={(exam.ThoiGianBatDau || "").slice(0, 5)}
              endtime={(exam.ThoiGianKetThuc || "").slice(0, 5)}
              date={exam.NgayKham ? formatDate(exam.NgayKham) : "Chưa rõ"}
              image={
                exam.image ||
                "https://png.pngtree.com/png-clipart/20240310/original/pngtree-doctor-png-png-image-png-free-png-ai-generative-png-image_14562990.png"
              } // Ảnh bác sĩ
              onRegister={() => registerExam(exam._id)} // Gọi API với exam.id làm "caKhamId"
            />
          ))}
        </div>
      </div>
      {/* Phân trang */}
      <div className="pagination">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            className={`pagination-button ${
              currentPage === index + 1 ? "active" : ""
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
