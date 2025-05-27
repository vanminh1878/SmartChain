import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sIsLoggedIn } from "../../../../store";
import passwordIcon from "../../../assets/icons/password.png"; // Icon Mật khẩu
import usernameIcon from "../../../assets/icons/user.png"; // Icon Tên đăng nhập
import logo from "../../../assets/images/clinic4.png";
import nurseIcon from "../../../assets/images/nurse.png"; // Biểu tượng y tá
import { showErrorMessageBox } from "../../../components/MessageBox/ErrorMessageBox/showErrorMessageBox"; // Đường dẫn tới hàm hiển thị MessageBox
import Textbox from "../../../components/Other/Textbox"; // Đường dẫn tới component
import { fetchPost } from "../../../lib/httpHandler";
import "../../../styles/index.css";
import "./Login.css";
export default function Login() {
  const [tenTaiKhoan, setTenTaiKhoan] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const dataSend = {
      TenTaiKhoan: tenTaiKhoan,
      MatKhau: matKhau,
    };
    const uri = "/api/login";
    fetchPost(
      uri,
      dataSend,
      (sus) => {
        console.log("Login response:", sus);
        console.log("Token saved:", sus.data.token);
        localStorage.setItem("jwtToken", sus.data.token);
        sIsLoggedIn.set(true);
        if (sus.data.user.VaiTroId === "000000000000000000000004") {
          navigate("/");
        } else if (sus.data.user.VaiTroId === "000000000000000000000001") {
          navigate("/admin");
        } else {
          navigate("/staff");
        }
      },
      (fail) => {
        showErrorMessageBox(fail.message);
      },
      () => {
        showErrorMessageBox("Có lỗi xảy ra");
      }
    );
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <h1 className="login-title">DERMATOLOGY CLINIC</h1>
        <div className="login-image">
          {/* Đặt ảnh tại đây */}
          <img src={logo} alt="Phòng mạch tư" />
        </div>
      </div>
      <div className="login-right">
        <div className="login-form">
          <div className="form-header">
            <h3 className="form-title">ĐĂNG NHẬP</h3>
            <img src={nurseIcon} alt="Nurse Icon" className="nurse-icon" />
          </div>
          <div className="form-body">
            <Textbox
              icon={usernameIcon}
              placeholder="Tên đăng nhập"
              onChange={(e) => setTenTaiKhoan(e.target.value)}
            />
            <Textbox
              icon={passwordIcon}
              placeholder="Mật khẩu"
              type="password"
              onChange={(e) => setMatKhau(e.target.value)}
            />
            <div className="form-links">
              <Link to="/register" className="form-link">
                Tạo tài khoản
              </Link>
              <Link to="/forget-password" className="form-link">
                Quên mật khẩu
              </Link>
            </div>
            <button onClick={handleLogin} className="submit-button">
              Đăng nhập
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
