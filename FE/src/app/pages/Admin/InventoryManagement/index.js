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
  const [openDialog, setOpenDialog] = useState("");
  const [productSearchText, setProductSearchText] = useState("");
  const [intakeSearchText, setIntakeSearchText] = useState("");
  const [orderSearchText, setOrderSearchText] = useState("");
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const fetchStores = useCallback(() => {
    fetchGet(
      "/Stores",
      (res) => {
        console.log("Dữ liệu từ API /Stores:", res);
        const storeList = Array.isArray(res) ? res : [];
        setStores(storeList);
        if (storeList.length > 0) setSelectedStore(storeList[0].id);
      },
      (fail) => {
        console.error("Lỗi khi lấy danh sách cửa hàng:", fail);
        toast.error("Lỗi khi lấy danh sách cửa hàng");
      },
      () => {
        console.error("Có lỗi xảy ra khi lấy danh sách cửa hàng");
        toast.error("Có lỗi xảy ra khi lấy danh sách cửa hàng");
      }
    );
  }, []);

  const fetchProducts = useCallback(() => {
    if (!selectedStore) return;
    setIsLoadingProducts(true);
    fetchGet(
      "/Inventory/Products",
      (res) => {
        console.log("Dữ liệu từ API /Inventory/Products:", res);
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

        console.log("Dữ liệu sản phẩm sau ánh xạ:", validatedProducts);
        setProducts(validatedProducts);
        setIsLoadingProducts(false);
      },
      (fail) => {
        console.error("Lỗi khi lấy danh sách sản phẩm:", fail);
        toast.error("Lỗi khi lấy danh sách sản phẩm");
        setProducts([]);
        setIsLoadingProducts(false);
      },
      () => {
        console.error("Có lỗi xảy ra khi lấy danh sách sản phẩm");
        toast.error("Có lỗi xảy ra khi lấy danh sách sản phẩm");
        setIsLoadingProducts(false);
      }
    );
  }, [selectedStore]);

  const fetchSuppliers = useCallback(() => {
    fetchGet(
      "/Suppliers",
      (res) => {
        console.log("Dữ liệu từ API /Suppliers:", res);
        const supplierList = Array.isArray(res) ? res : [];
        setSuppliers(supplierList);
      },
      (fail) => {
        console.error("Lỗi khi lấy danh sách nhà cung cấp:", fail);
        toast.error("Lỗi khi lấy danh sách nhà cung cấp");
      },
      () => {
        console.error("Có lỗi xảy ra khi lấy danh sách nhà cung cấp");
        toast.error("Có lỗi xảy ra khi lấy danh sách nhà cung cấp");
      }
    );
  }, []);

  const fetchStockIntakes = useCallback(() => {
    fetchGet(
      `/Inventory/StockIntakes`,
      (res) => {
        console.log("Dữ liệu từ API /StockIntake:", res);
        const intakeList = Array.isArray(res) ? res : [];
        setStockIntakes(intakeList);
      },
      (fail) => {
        console.error("Lỗi khi lấy danh sách phiếu nhập kho:", fail);
        toast.error("Lỗi khi lấy danh sách phiếu nhập kho");
      },
      () => {
        console.error("Có lỗi xảy ra khi lấy danh sách phiếu nhập kho");
        toast.error("Có lỗi xảy ra khi lấy danh sách phiếu nhập kho");
      }
    );
  }, []);

  const fetchPurchaseOrders = useCallback(() => {
    console.log("Fetching PurchaseOrders for store:");
    fetchGet(
      `/Inventory/PurchaseOrders`,
      (res) => {
        console.log("Dữ liệu từ API /PurchaseOrders:", res);
        const intakeList = Array.isArray(res) ? res : [];
        setPurchaseOrders(intakeList);
      },
      (fail) => {
        console.error("Lỗi khi lấy danh sách phiếu nhập kho:", fail);
        toast.error("Lỗi khi lấy danh sách phiếu nhập kho");
      },
      () => {
        console.error("Có lỗi xảy ra khi lấy danh sách phiếu nhập kho");
        toast.error("Có lỗi xảy ra khi lấy danh sách phiếu nhập kho");
      }
    );
  }, []);

  const handleCreateIntake = useCallback(
    (newIntake) => {
      fetchPost(
        "/StockIntakes",
        newIntake,
        (res) => {
          console.log("Kết quả tạo phiếu nhập kho:", res);
          toast.success("Tạo phiếu nhập kho thành công");
          setOpenDialog(false);
          fetchStockIntakes();
          fetchProducts();
        },
        (fail) => {
          console.error("Lỗi khi tạo phiếu nhập kho:", fail);
          toast.error("Lỗi khi tạo phiếu nhập kho");
        },
        () => {
          console.error("Có lỗi xảy ra khi tạo phiếu nhập kho");
          toast.error("Có lỗi xảy ra khi tạo phiếu nhập kho");
        }
      );
    },
    [fetchStockIntakes, fetchProducts]
  );

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    const validProducts = products.filter((item) => item && item.id && typeof item === "object");
    if (!productSearchText.trim()) return validProducts;
    const lowercasedSearch = productSearchText.toLowerCase();
    return validProducts.filter(
      (item) => item.name?.toLowerCase().includes(lowercasedSearch)
    );
  }, [products, productSearchText]);

  const filteredStockIntakes = useMemo(() => {
    if (!Array.isArray(stockIntakes)) return [];
    if (!intakeSearchText.trim()) return stockIntakes;
    const lowercasedSearch = intakeSearchText.toLowerCase();
    return stockIntakes.filter((intake) => {
      const supplier = suppliers.find((s) => s.id === intake.supplier_id);
      return (
        supplier?.name?.toLowerCase().includes(lowercasedSearch) ||
        intake.intake_date?.includes(lowercasedSearch)
      );
    });
  }, [stockIntakes, intakeSearchText, suppliers]);

  const filteredPurchaseOrders = useMemo(() => {
    if (!Array.isArray(purchaseOrders)) return [];
    if (!orderSearchText.trim()) return purchaseOrders;
    const lowercasedSearch = orderSearchText.toLowerCase();
    return purchaseOrders.filter((order) => {
      return (
        order.supplier?.toLowerCase().includes(lowercasedSearch)
      );
    });
  }, [purchaseOrders, orderSearchText]);

  useEffect(() => {
    fetchStores();
    fetchSuppliers();
  }, [fetchStores, fetchSuppliers]);

  useEffect(() => {
    if (selectedStore) {
      fetchProducts();
      fetchStockIntakes();
      fetchPurchaseOrders();
    }
  }, [selectedStore, fetchProducts, fetchStockIntakes, fetchPurchaseOrders]);

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
      valueGetter: (params) => {
        const value = typeof params === "number" ? params : params.row?.unit_price || 0;
        return `${value.toLocaleString("vi-VN")} VNĐ`;
      },
    },
    {
      field: "price",
      headerName: "Giá bán",
      width: 120,
      valueGetter: (params) => {
        const value = typeof params === "number" ? params : params.row?.price || 0;
        return `${value.toLocaleString("vi-VN")} VNĐ`;
      },
    },
    {
      field: "stock_quantity",
      headerName: "Tồn kho",
      width: 120,
      valueGetter: (params) => {
        const value = typeof params === "number" ? params : params.row?.stock_quantity || 0;
        return `${value} cái`;
      },
    },
  ];

  const intakeColumns = [
    { field: "stockIntakeId", headerName: "ID", width: 100 },
    { field: "supplier", headerName: "Nhà cung cấp", width: 200 },
    { field: "intakeDate", headerName: "Ngày nhập", width: 150 },
    { field: "created_By_Name", headerName: "Người tạo", width: 150 },
    { field: "status", headerName: "Trạng thái", width: 120 },
    { field: "approved_By_Name", headerName: "Người phê duyệt", width: 150 },
  ];

  const orderColumns = [
    { field: "supplier", headerName: "Nhà cung cấp", width: 200 },
    { field: "intakeDate", headerName: "Ngày nhập", width: 150 },
    {
      field: "totalAmount",
      headerName: "Tổng tiền",
      width: 120,
      valueGetter: (params) => {
        const value = typeof params === "number" ? params : params.row?.totalAmount || 0;
        return `${value.toLocaleString("vi-VN")} VNĐ`;
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
      <DataGrid
        sx={{ borderLeft: 0, borderRight: 0, borderRadius: 0 }}
        rows={filteredPurchaseOrders}
        getRowId={(row) => row.supplierId}
        columns={orderColumns}
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: 5 } },
        }}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
      />

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