import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchGet, fetchPut, fetchPost } from "../../../lib/httpHandler";
import "./AccountManagement.css";

export default function AccountManagement() {
  const [userInfo, setUserInfo] = useState({
    username: "",
    fullname: "",
    email: "",
    phoneNumber: "",
    birthday: "",
    address: "",
    sex: false,
    avatar: "",
    roleName: "",
    status: true,
  });
  const [newPassword, setNewPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    fetchGet(
    "/users/profile",
    (sus) => {
      console.log("Dữ liệu người dùng:", sus);
      setUserInfo({
        username: sus.username,
        fullname: sus.fullname,
        email: sus.email,
        phoneNumber: sus.phoneNumber,
        birthday: sus.birthday ? new Date(sus.birthday).toISOString().split("T")[0] : "",
        address: sus.address || "",
        sex: sus.sex,
        avatar: sus.avatar || "",
        roleName: sus.roleName,
      });
    },
    (fail) => {
      toast.error(fail.message || "Không thể tải thông tin cá nhân");
    },
    () => {
      toast.error("Có lỗi xảy ra khi tải thông tin");
    }
  );
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSexChange = (e) => {
    setUserInfo((prev) => ({ ...prev, sex: e.target.value === "true" }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setUserInfo((prev) => ({ ...prev, avatar: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", userInfo.fullname);
    formData.append("email", userInfo.email);
    formData.append("phoneNumber", userInfo.phoneNumber);
    formData.append("birthday", userInfo.birthday);
    formData.append("address", userInfo.address);
    formData.append("sex", userInfo.sex.toString());
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    fetchPut(
      "/users/profile",
      formData,
      (sus) => {
        toast.success("Cập nhật thông tin thành công!");
      },
      (fail) => {
        toast.error(fail.message || "Cập nhật thông tin thất bại!");
      },
      () => {
        toast.error("Có lỗi xảy ra khi cập nhật thông tin!");
      }
    );
  };

  const handleUpdatePassword = () => {
    if (!newPassword) {
      toast.error("Vui lòng nhập mật khẩu mới!");
      return;
    }

    fetchPost(
      "/auth/update-password",
      { username: userInfo.username, newPassword },
      (sus) => {
        toast.success("Cập nhật mật khẩu thành công!");
        setNewPassword("");
      },
      (fail) => {
        toast.error(fail.message || "Cập nhật mật khẩu thất bại!");
      },
      () => {
        toast.error("Có lỗi xảy ra khi cập nhật mật khẩu!");
      }
    );
  };

  return (
    <>
      <ToastContainer />
      <div className="personal-information">
        <h2 className="title">Thông Tin Cá Nhân</h2>
        <div className="profile-container">
          <div className="avatar-section">
            <img
              src={userInfo.avatar || "https://via.placeholder.com/150"}
              alt="Avatar"
              className="avatar-image"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="avatar-upload"
              id="avatar-upload"
            />
            <label htmlFor="avatar-upload" className="upload-button">
              Tải ảnh lên
            </label>
          </div>
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label>Họ và tên:</label>
              <input
                type="text"
                name="fullname"
                value={userInfo.fullname}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={userInfo.email}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Số điện thoại:</label>
              <input
                type="text"
                name="phoneNumber"
                value={userInfo.phoneNumber}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Địa chỉ:</label>
              <input
                type="text"
                name="address"
                value={userInfo.address}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Ngày sinh:</label>
              <input
                type="date"
                name="birthday"
                value={userInfo.birthday}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Giới tính:</label>
              <select
                name="sex"
                value={userInfo.sex}
                onChange={handleSexChange}
                className="form-input"
              >
                <option value={true}>Nam</option>
                <option value={false}>Nữ</option>
              </select>
            </div>
            <div className="form-group">
              <label>Vai trò:</label>
              <input
                type="text"
                value={userInfo.roleName}
                disabled
                className="form-input"
              />
            </div>

            {/* <div className="form-group">
              <label>Trạng thái:</label>
              <input
                type="text"
                value={userInfo.status ? "Hoạt động" : "Khóa"}
                disabled
                className="form-input"
              />
            </div> */}
            <button type="submit" className="submit-button">
              Lưu thay đổi
            </button>
          </form>
          <div className="password-section">
            <h3>Đổi mật khẩu</h3>
            <div className="form-group">
              <label>Tên tài khoản:</label>
              <input
                type="text"
                value={userInfo.username}
                disabled
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Mật khẩu mới:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form-input"
              />
            </div>
            <button onClick={handleUpdatePassword} className="submit-button">
              Cập nhật mật khẩu
            </button>
          </div>
        </div>
      </div>
    </>
  );
}