let BE_ENPOINT = "http://localhost:5000";

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
    const data = await res.json();
    if (!res.ok) {
      onFail(data);
      return;
    }
    onSuccess(data);
  } catch {
    onException();
  }
};

const fetchPost = async (uri, reqData, onSuccess, onFail, onException) => {
  try {
    const res = await fetch(BE_ENPOINT + uri, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(reqData),
    });
    const data = await res.json();
    if (!res.ok) {
      onFail(data);
      return;
    }
    onSuccess(data);
  } catch (e) {
    console.log(e);
    onException();
  }
};

const fetchDelete = async (uri, reqData, onSuccess, onFail, onException) => {
  try {
    const res = await fetch(BE_ENPOINT + uri, {
      method: "DELETE",
      headers: getHeaders(),
      body: reqData ? JSON.stringify(reqData) : null, // Không gửi body nếu reqData là null hoặc rỗng
    });
    const data = await res.json();
    if (!res.ok) {
      onFail(data);
      return;
    }
    onSuccess(data);
  } catch (error) {
    console.error("Fetch DELETE error:", error.message); // Log lỗi chi tiết
    onException();
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
    const data = await res.json();
    if (!res.ok) {
      onFail(data);
      return;
    }
    onSuccess(data);
  } catch {
    onException();
  }
};

const fetchUpload = async (uri, formData, onSuccess, onFail, onException) => {
  try {
    const res = await fetch(BE_ENPOINT + uri, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) {
      onFail(data);
      return;
    }
    onSuccess(data);
  } catch {
    onException();
  }
};
export { fetchGet, fetchPost, fetchDelete, fetchPut, fetchUpload, BE_ENPOINT };
