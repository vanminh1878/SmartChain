const BE_ENPOINT = "http://localhost:5000";

const HEADERS = {
  "Content-Type": "application/json",
  accept: "application/json",
};

const getHeaders = () => {
  const token = localStorage.getItem("jwtToken");
  if (token === null) {
    return HEADERS;
  }
  return {
    ...HEADERS,
    Authorization: `Bearer ${token}`,
  };
};

const fetchGet = async (uri, onSuccess, onFail, onException) => {
  try {
    const res = await fetch(BE_ENPOINT + uri, {
      method: "GET",
      headers: getHeaders(),
    });

    // Kiểm tra mã trạng thái 204 (No Content)
    if (res.status === 204) {
      return onSuccess({});
    }

    const data = await res.json();
    if (!res.ok) {
      return onFail({ title: data.title, status: res.status });
    }
    return onSuccess(data); // Thêm return
  } catch (error) {
    console.error("Fetch GET error:", error.message);
    return onException(); // Thêm return
  }
};


const fetchPost = async (uri, reqData, onSuccess, onFail, onException) => {
  try {
    const res = await fetch(BE_ENPOINT + uri, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(reqData),
    });

    // Kiểm tra mã trạng thái 204 (No Content)
    if (res.status === 204) {
      return onSuccess({ message: "Thành công" });
    }

    const data = await res.json();
    if (!res.ok) {
      return onFail({ title: data.title, status: res.status });
    }
    return onSuccess(data);
  } catch (error) {
    console.error("Fetch POST error:", error.message);
    return onException();
  }
};
const fetchDelete = async (uri, reqData, onSuccess, onFail, onException) => {
  try {
    const res = await fetch(BE_ENPOINT + uri, {
      method: "DELETE",
      headers: getHeaders(),
      body: reqData ? JSON.stringify(reqData) : null,
    });

    // Kiểm tra mã trạng thái 204 (No Content)
    if (res.status === 204) {
      return onSuccess({ message: "Xóa thành công" });
    }

    const data = await res.json();
    if (!res.ok) {
      return onFail({ title: data.title, status: res.status });
    }
    return onSuccess(data); // Thêm return
  } catch (error) {
    console.error("Fetch DELETE error:", error.message);
    return onException(); // Thêm return
  }
};

const fetchPut = async (uri, reqData, onSuccess, onFail, onException) => {
  try {
    const options = {
      method: "PUT",
      headers: getHeaders(),
    };
    if (reqData) {
      options.body = JSON.stringify(reqData);
    }
    const res = await fetch(BE_ENPOINT + uri, options);

    // Kiểm tra mã trạng thái 204 (No Content)
    if (res.status === 204) {
      return onSuccess({ message: "Cập nhật thành công" });
    }

    const data = await res.json();
    if (!res.ok) {
      return onFail({ title: data.title, status: res.status });
    }
    return onSuccess(data); // Thêm return
  } catch (error) {
    console.error("Fetch PUT error:", error.message);
    return onException(); // Thêm return
  }
};

const fetchUpload = async (uri, formData, onSuccess, onFail, onException) => {
  try {
    const res = await fetch(BE_ENPOINT + uri, {
      method: "POST",
      body: formData,
    });

    // Kiểm tra mã trạng thái 204 (No Content)
    if (res.status === 204) {
      return onSuccess({ message: "Tải lên thành công" });
    }

    const data = await res.json();
    if (!res.ok) {
      return onFail({ title: data.title, status: res.status });
    }
    return onSuccess(data); // Thêm return
  } catch (error) {
    console.error("Fetch UPLOAD error:", error.message);
    return onException(); // Thêm return
  }
};

export { fetchGet, fetchPost, fetchDelete, fetchPut, fetchUpload, BE_ENPOINT };