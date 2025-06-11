import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchGet, fetchPost } from "../../../lib/httpHandler";
import SearchIcon from "@mui/icons-material/Search";
import { Avatar } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddStockIntake from "../../../components/Admin/InventoryManagement/AddStockIntake/AddStockIntake";

const Product = ({ productName }) => (
  <Box sx={{ display: "flex", alignItems: "center" }}>
    <Avatar alt={productName} sx={{ width: 30, height: 30 }}>
      {productName ? productName[0].toUpperCase() : "A"}
    </Avatar>
    <Typography sx={{ mx: 3 }} variant="subtitle2">
      {productName}
    </Typography>
  </Box>
);

export default function InventoryManagement() {
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [stockIntakes, setStockIntakes] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [productSearchText, setProductSearchText] = useState("");
  const [intakeSearchText, setIntakeSearchText] = useState("");
  const [orderSearchText, setOrderSearchText] = useState("");
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const fetchStores = useCallback(() => {
    fetchGet(
      "/Stores",
      (res) => {
        const storeList = Array.isArray(res) ? res : [];
        setStores(storeList);
        if (storeList.length > 0) setSelectedStore(storeList[0].id);
      },
      (fail) => {
        console.error("Lỗi khi lấy danh sách cửa hàng:", fail);
        toast.error("Lỗi khi lấy danh sách cửa hàng");
      }
    );
  }, []);

  const fetchProducts = useCallback(() => {
    if (!selectedStore) return;
    setIsLoadingProducts(true);
    fetchGet(
      "/Inventory/Products",
      (res) => {
        const productList = Array.isArray(res) ? res : [];
        if (!productList.length) {
          toast.error("Không có dữ liệu sản phẩm");
          setProducts([]);
          setIsLoadingProducts(false);
          return;
        }

        const validatedProducts = productList
          .filter((item) => item && typeof item === "object" && item.productId && item.storeId === selectedStore)
          .map((item) => ({
            id: item.productId,
            name: item.tenSanPham || "Không xác định",
            category: item.danhMuc || "Không xác định",
            supplier: item.nhaCungCap || "Không xác định",
            store: item.cuaHang || "Không xác định",
            unit_price: Number(item.giaNhap) || 0,
            price: Number(item.giaBan) || 0,
            stock_quantity: Number(item.tonKho) || 0,
          }));

        setProducts(validatedProducts);
        setIsLoadingProducts(false);
      },
      (fail) => {
        console.error("Lỗi khi lấy danh sách sản phẩm:", fail);
        toast.error("Lỗi khi lấy danh sách sản phẩm");
        setProducts([]);
        setIsLoadingProducts(false);
      }
    );
  }, [selectedStore]);

  const fetchSuppliers = useCallback(() => {
    fetchGet(
      "/Suppliers",
      (res) => {
        const supplierList = Array.isArray(res) ? res : [];
        setSuppliers(supplierList);
      },
      (fail) => {
        console.error("Lỗi khi lấy danh sách nhà cung cấp:", fail);
        toast.error("Lỗi khi lấy danh sách nhà cung cấp");
      }
    );
  }, []);

  const fetchStockIntakes = useCallback(() => {
    fetchGet(
      "/Inventory/StockIntakes",
      (res) => {
        const intakeList = Array.isArray(res) ? res : [];

        Promise.all(
          intakeList
            .filter((item) => item && typeof item === "object" && item.id)
            .map(
              (item) =>
                new Promise((resolve) => {
                  let createdByName = "Không xác định";
                  let approvedByName = "Không xác định";

                  let fetchCount = 0;
                  const totalFetches = (item.createdBy ? 1 : 0) + (item.approvedBy ? 1 : 0);

                  const resolveIfDone = () => {
                    fetchCount++;
                    if (fetchCount === totalFetches || totalFetches === 0) {
                      resolve({
                        ...item,
                        stockIntakeId: item.id,
                        intakeDate: item.createdAt || "Không xác định",
                        created_By_Name: createdByName,
                        approved_By_Name: approvedByName,
                      });
                    }
                  };

                  if (item.createdBy) {
                    fetchGet(
                      `/Users/${item.createdBy}`,
                      (userRes) => {
                        createdByName = userRes?.fullname || "Không xác định";
                        resolveIfDone();
                      },
                      (error) => {
                        console.error(`Lỗi khi lấy thông tin user ${item.createdBy}:`, error);
                        resolveIfDone();
                      }
                    );
                  }

                  if (item.approvedBy) {
                    fetchGet(
                      `/Users/${item.approvedBy}`,
                      (userRes) => {
                        approvedByName = userRes?.fullname || "Không xác định";
                        resolveIfDone();
                      },
                      (error) => {
                        console.error(`Lỗi khi lấy thông tin user ${item.approvedBy}:`, error);
                        resolveIfDone();
                      }
                    );
                  }

                  if (!item.createdBy && !item.approvedBy) {
                    resolveIfDone();
                  }
                })
            )
        )
          .then((validatedIntakes) => {
            setStockIntakes(validatedIntakes);
            console.log("Danh sách phiếu nhập kho:", validatedIntakes);
          })
          .catch((error) => {
            console.error("Lỗi khi xử lý danh sách phiếu nhập kho:", error);
            toast.error("Lỗi khi xử lý danh sách phiếu nhập kho");
          });
      },
      (fail) => {
        console.error("Lỗi khi lấy danh sách phiếu nhập kho:", fail);
        toast.error("Lỗi khi lấy danh sách phiếu nhập kho");
      }
    );
  }, []);

  const fetchPurchaseOrders = useCallback(() => {
    setIsLoadingOrders(true);
    fetchGet(
      "/Inventory/PurchaseOrders",
      (res) => {
        console.log("Raw API response:", res);
        const orderList = Array.isArray(res) ? res : [];
        const validatedOrders = orderList
          .filter((item) => item && typeof item === "object" && item.supplierId)
          .map((item, index) => ({
            id: item.id || item.supplierId || `temp-id-${index}`, // Sử dụng id từ API hoặc supplierId làm fallback
            supplierId: item.supplierId,
            supplier: item.supplier || "Không xác định",
            intakeDate: item.intakeDate || "Không xác định",
            totalAmount: Number(item.totalAmount) || 0,
            purchaseOrders: item.purchaseOrders || [],
          }));
        console.log("Danh sách phiếu đặt hàng:", validatedOrders);
        setPurchaseOrders(validatedOrders);
        setIsLoadingOrders(false);
      },
      (fail) => {
        console.error("Lỗi khi lấy danh sách phiếu đặt hàng:", fail);
        toast.error("Lỗi khi lấy danh sách phiếu đặt hàng");
        setIsLoadingOrders(false);
      }
    );
  }, []);

  const handleCreateIntake = useCallback(
    (newIntake) => {
      fetchPost(
        "/StockIntakes",
        newIntake,
        (res) => {
          toast.success("Tạo phiếu nhập kho thành công");
          setOpenDialog(false);
          fetchStockIntakes();
          fetchProducts();
        },
        (fail) => {
          console.error("Lỗi khi tạo phiếu nhập kho:", fail);
          toast.error("Lỗi khi tạo phiếu nhập kho");
        }
      );
    },
    [fetchStockIntakes, fetchProducts]
  );

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    const validProducts = products.filter((item) => item && item.id);
    if (!productSearchText.trim()) return validProducts;
    const lowercasedSearch = productSearchText.toLowerCase();
    return validProducts.filter((item) => item.name?.toLowerCase().includes(lowercasedSearch));
  }, [products, productSearchText]);

  const filteredStockIntakes = useMemo(() => {
    if (!Array.isArray(stockIntakes)) return [];
    if (!intakeSearchText.trim()) return stockIntakes;
    const lowercasedSearch = intakeSearchText.toLowerCase();
    return stockIntakes.filter(
      (intake) =>
        intake.created_By_Name?.toLowerCase().includes(lowercasedSearch) ||
        intake.intakeDate?.toLowerCase().includes(lowercasedSearch)
    );
  }, [stockIntakes, intakeSearchText]);

  const filteredPurchaseOrders = useMemo(() => {
    if (!Array.isArray(purchaseOrders)) return [];
    if (!orderSearchText.trim()) return purchaseOrders;
    const lowercasedSearch = orderSearchText.toLowerCase();
    return purchaseOrders.filter((order) =>
      order.supplier?.toLowerCase().includes(lowercasedSearch)
    );
  }, [purchaseOrders, orderSearchText]);

  useEffect(() => {
    fetchStores();
    fetchSuppliers();
    fetchStockIntakes();
    fetchPurchaseOrders();
  }, [fetchStores, fetchSuppliers, fetchStockIntakes, fetchPurchaseOrders]);

  useEffect(() => {
    if (selectedStore) {
      fetchProducts();
    }
  }, [selectedStore, fetchProducts]);

  useEffect(() => {
    console.log("Updated purchaseOrders:", purchaseOrders);
  }, [purchaseOrders]);

  const productColumns = [
    {
      field: "product",
      headerName: "Tên SP",
      width: 250,
      renderCell: (cellData) => <Product productName={cellData.row?.name || "Không xác định"} />,
    },
    { field: "category", headerName: "Danh mục", width: 150 },
    { field: "supplier", headerName: "Nhà cung cấp", width: 200 },
    { field: "store", headerName: "Cửa hàng", width: 150 },
    {
      field: "unit_price",
      headerName: "Giá nhập",
      width: 120,
      valueFormatter: ({ value }) =>
        value != null ? `${Number(value).toLocaleString("vi-VN")} VNĐ` : "0 VNĐ",
    },
    {
      field: "price",
      headerName: "Giá bán",
      width: 120,
      valueFormatter: ({ value }) =>
        value != null ? `${Number(value).toLocaleString("vi-VN")} VNĐ` : "0 VNĐ",
    },
    {
      field: "stock_quantity",
      headerName: "Tồn kho",
      width: 120,
      valueFormatter: ({ value }) => `${value || 0} cái`,
    },
  ];

  const intakeColumns = [
    { field: "stockIntakeId", headerName: "ID", width: 300 },
    {
    field: "intakeDate",
    headerName: "Ngày nhập",
    width: 200,
    renderCell: (params) => {
      console.log("IntakeDate:", params.row.intakeDate);
      const date = params.row.intakeDate
        ? new Date(params.row.intakeDate).toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
        : "Không xác định";
      return date;
    },
  },
    { field: "created_By_Name", headerName: "Người tạo", width: 150 },
    { field: "status", headerName: "Trạng thái", width: 120 },
    { field: "approved_By_Name", headerName: "Người phê duyệt", width: 150 },
  ];

  const orderColumns = [
    { field: "supplier", headerName: "Nhà cung cấp", width: 300 },
     {
    field: "intakeDate",
    headerName: "Ngày nhập",
    width: 300,
    renderCell: (params) => {
      console.log("IntakeDate:", params.row.intakeDate);
      const date = params.row.intakeDate
        ? new Date(params.row.intakeDate).toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
        : "Không xác định";
      return date;
    },
  },
    {
      field: "totalAmount",
      headerName: "Tổng tiền",
      width: 300,
      renderCell: (params) => {
        console.log("TotalAmount:", params.row.totalAmount); // Log totalAmount
        return params.row.totalAmount != null
          ? `${Number(params.row.totalAmount).toLocaleString("vi-VN")} VNĐ`
          : "0 VNĐ";
      },
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <ToastContainer />
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Cửa hàng</InputLabel>
        <Select
          value={selectedStore}
          onChange={(e) => setSelectedStore(e.target.value)}
          sx={{ backgroundColor: "white" }}
        >
          {stores.map((store) => (
            <MenuItem key={store.id} value={store.id}>
              {store.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Danh sách sản phẩm của cửa hàng
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <TextField
          placeholder="Tìm kiếm sản phẩm"
          value={productSearchText}
          onChange={(e) => setProductSearchText(e.target.value)}
          sx={{ width: "40%", backgroundColor: "white" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Tạo phiếu nhập kho
        </Button>
      </Box>
      {isLoadingProducts ? (
        <Typography>Đang tải dữ liệu sản phẩm...</Typography>
      ) : (
        <DataGrid
          sx={{ borderLeft: 0, borderRight: 0, borderRadius: 0, mb: 4 }}
          rows={filteredProducts}
          columns={productColumns}
          getRowId={(row) => row.id}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 10 } },
          }}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
        />
      )}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Danh sách phiếu nhập kho
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <TextField
          placeholder="Tìm kiếm theo nhà cung cấp"
          value={intakeSearchText}
          onChange={(e) => setIntakeSearchText(e.target.value)}
          sx={{ width: "40%", backgroundColor: "white" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <DataGrid
        sx={{ borderLeft: 0, borderRight: 0, borderRadius: 0, mb: 4 }}
        rows={filteredStockIntakes}
        columns={intakeColumns}
        getRowId={(row) => row.stockIntakeId}
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: 5 } },
        }}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
      />
      <Typography variant="h5" sx={{ mb: 2 }}>
        Danh sách phiếu đặt hàng
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <TextField
          placeholder="Tìm kiếm theo nhà cung cấp"
          value={orderSearchText}
          onChange={(e) => setOrderSearchText(e.target.value)}
          sx={{ width: "40%", backgroundColor: "white" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      {isLoadingOrders ? (
        <Typography>Đang tải dữ liệu phiếu đặt hàng...</Typography>
      ) : (
        <DataGrid
          sx={{ borderLeft: 0, borderRight: 0, borderRadius: 0 }}
          rows={filteredPurchaseOrders}
          columns={orderColumns}
          getRowId={(row) => row.id}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 5 } },
          }}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
        />
      )}
      <AddStockIntake
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        stores={stores}
        suppliers={suppliers}
        products={products}
        onCreateIntake={handleCreateIntake}
      />
    </Box>
  );
}