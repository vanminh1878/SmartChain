import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchGet, fetchPost } from "../../../lib/httpHandler"; // Giả định thêm fetchPost
import SearchIcon from "@mui/icons-material/Search";
import { Avatar } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

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
  const [products, setProducts] = useState([]);
  const [stockIntakes, setStockIntakes] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newIntake, setNewIntake] = useState({
    supplier_id: "",
    store_id: "1", // Giả định cửa hàng mặc định
    intake_date: new Date().toISOString().split("T")[0],
    created_by: "1", // Giả định người dùng hiện tại
    details: [{ product_id: "", quantity: 0, unit_price: 0 }],
  });
  const [searchText, setSearchText] = useState("");
  const [overviewData, setOverviewData] = useState({
    totalProducts: 0,
    stockIssues: 0,
    pendingIntakes: 0,
  });

  // Lấy danh sách sản phẩm
  const fetchProducts = useCallback(() => {
    fetchGet(
      "/Products",
      async (res) => {
        const productList = Array.isArray(res) ? res : [];
        if (!productList.length) {
          toast.error("Không có dữ liệu sản phẩm");
        }

        const validatedProducts = await Promise.all(
          productList.map(async (item, index) => {
            let categoryData = {};
            if (item.category_id) {
              try {
                await fetchGet(
                  `/Categories/${item.category_id}`,
                  (categoryRes) => {
                    categoryData = categoryRes;
                  },
                  (fail) => {
                    toast.error(`Lỗi khi lấy danh mục ${item.category_id}`);
                  }
                );
              } catch (error) {
                console.error(`Lỗi khi gọi API danh mục: ${error}`);
              }
            }

            return {
              ...item,
              id: item.id || `temp-${Date.now()}-${index}`,
              category: categoryData.name || "Không xác định",
              profit_margin: item.profit_margin || 0.3, // Giả định tỷ lệ lợi nhuận mặc định 30%
            };
          })
        );

        setProducts(validatedProducts);
        setOverviewData((prev) => ({
          ...prev,
          totalProducts: validatedProducts.length,
          stockIssues: validatedProducts.filter((p) => p.stock_quantity < 10).length,
        }));
      },
      (fail) => {
        toast.error("Lỗi khi lấy danh sách sản phẩm");
        setProducts([]);
      }
    );
  }, []);

  // Lấy danh sách nhà cung cấp
  const fetchSuppliers = useCallback(() => {
    fetchGet(
      "/Suppliers",
      (res) => {
        const supplierList = Array.isArray(res) ? res : [];
        setSuppliers(supplierList);
      },
      (fail) => {
        toast.error("Lỗi khi lấy danh sách nhà cung cấp");
      }
    );
  }, []);

  // Lấy danh sách phiếu nhập kho
  // const fetchStockIntakes = useCallback(() => {
  //   fetchGet(
  //     "/Stock_Intake",
  //     (res) => {
  //       const intakeList = Array.isArray(res) ? res : [];
  //       setStockIntakes(intakeList);
  //       setOverviewData((prev) => ({
  //         ...prev,
  //         pendingIntakes: intakeList.filter((i) => i.status === 0).length,
  //       }));
  //     },
  //     (fail) => {
  //       toast.error("Lỗi khi lấy danh sách phiếu nhập kho");
  //     }
  //   );
  // }, []);

  // Gửi phiếu nhập kho mới
  // const handleCreateIntake = useCallback(() => {
  //   fetchPost(
  //     "/Stock_Intake",
  //     newIntake,
  //     (res) => {
  //       toast.success("Tạo phiếu nhập kho thành công");
  //       setOpenDialog(false);
  //       fetchStockIntakes();
  //       fetchProducts(); // Cập nhật lại sản phẩm sau khi nhập kho
  //     },
  //     (fail) => {
  //       toast.error("Lỗi khi tạo phiếu nhập kho");
  //     }
  //   );
  // }, [newIntake, fetchStockIntakes, fetchProducts]);

  // Cập nhật chi tiết phiếu nhập kho
  const handleAddDetail = () => {
    setNewIntake((prev) => ({
      ...prev,
      details: [...prev.details, { product_id: "", quantity: 0, unit_price: 0 }],
    }));
  };

  // Xử lý thay đổi chi tiết phiếu nhập kho
  const handleDetailChange = (index, field, value) => {
    setNewIntake((prev) => {
      const newDetails = [...prev.details];
      newDetails[index] = { ...newDetails[index], [field]: value };
      return { ...prev, details: newDetails };
    });
  };

  // Tìm kiếm theo danh mục hoặc nhà cung cấp
  const filteredStockIntakes = useMemo(() => {
    if (!Array.isArray(stockIntakes)) return [];
    if (!searchText.trim()) return stockIntakes;
    const lowercasedSearch = searchText.toLowerCase();
    return stockIntakes.filter((intake) => {
      const supplier = suppliers.find((s) => s.id === intake.supplier_id);
      return (
        supplier?.name?.toLowerCase().includes(lowercasedSearch) ||
        intake.intake_date.includes(lowercasedSearch)
      );
    });
  }, [stockIntakes, searchText, suppliers]);

  // Lấy dữ liệu khi component mount
  // useEffect(() => {
  //   fetchProducts();
  //   fetchSuppliers();
  //   fetchStockIntakes();
  // }, [fetchProducts, fetchSuppliers, fetchStockIntakes]);

  // Cột cho DataGrid phiếu nhập kho
  const intakeColumns = [
    { field: "id", headerName: "ID Phiếu", width: 100 },
    {
      field: "supplier_id",
      headerName: "Nhà cung cấp",
      width: 200,
      renderCell: (params) => {
        const supplier = suppliers.find((s) => s.id === params.row.supplier_id);
        return supplier ? supplier.name : "Không xác định";
      },
    },
    { field: "intake_date", headerName: "Ngày nhập", width: 150 },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 120,
      renderCell: (params) => (params.row.status === 0 ? "Chờ duyệt" : "Đã duyệt"),
    },
    {
      field: "created_by",
      headerName: "Người tạo",
      width: 150,
      renderCell: (params) => {
        // Giả định lấy tên người dùng từ API User
        return `User ${params.row.created_by}`;
      },
    },
  ];

  // Cột cho DataGrid sản phẩm
  const productColumns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "product",
      headerName: "Sản phẩm",
      width: 300,
      renderCell: (cellData) => <Product productName={cellData.row.name} />,
    },
    { field: "category", headerName: "Danh mục", width: 150 },
    {
      field: "price",
      headerName: "Giá bán",
      width: 120,
      valueGetter: (params) => `${(params.row.price || 0).toFixed(2)} VNĐ`,
    },
    {
      field: "stock_quantity",
      headerName: "Tồn kho",
      width: 120,
      valueGetter: (params) => `${params.row.stock_quantity} cái`,
    },
    {
      field: "unit_price",
      headerName: "Giá nhập",
      width: 120,
      valueGetter: (params) =>
        `${(params.row.unit_price || params.row.price / (1 + params.row.profit_margin)).toFixed(2)} VNĐ`,
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <ToastContainer />
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Quản lý nhập kho - Circle K
      </Typography>

      {/* Tổng quan */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={4}>
          <Box sx={{ p: 2, bgcolor: "white", borderRadius: 2, textAlign: "center" }}>
            <Typography variant="h6">{overviewData.totalProducts}</Typography>
            <Typography variant="subtitle2">Tổng sản phẩm</Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box sx={{ p: 2, bgcolor: "white", borderRadius: 2, textAlign: "center" }}>
            <Typography variant="h6">{overviewData.stockIssues}</Typography>
            <Typography variant="subtitle2">Sản phẩm tồn thấp</Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box sx={{ p: 2, bgcolor: "white", borderRadius: 2, textAlign: "center" }}>
            <Typography variant="h6">{overviewData.pendingIntakes}</Typography>
            <Typography variant="subtitle2">Phiếu nhập chờ duyệt</Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Tìm kiếm và nút thêm phiếu nhập */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <TextField
          placeholder="Tìm kiếm theo nhà cung cấp hoặc ngày nhập"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ width: "40%" }}
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

      {/* Bảng phiếu nhập kho */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Danh sách phiếu nhập kho
      </Typography>
      <DataGrid
        sx={{ borderLeft: 0, borderRight: 0, borderRadius: 0, mb: 4 }}
        rows={filteredStockIntakes}
        columns={intakeColumns}
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: 5 } },
        }}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
      />

      {/* Bảng sản phẩm */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Danh sách sản phẩm
      </Typography>
      <DataGrid
        sx={{ borderLeft: 0, borderRight: 0, borderRadius: 0 }}
        rows={products}
        columns={productColumns}
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: 10 } },
        }}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
      />

      {/* Dialog tạo phiếu nhập kho */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Tạo phiếu nhập kho mới</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Nhà cung cấp</InputLabel>
            <Select
              value={newIntake.supplier_id}
              onChange={(e) => setNewIntake({ ...newIntake, supplier_id: e.target.value })}
            >
              {suppliers.map((supplier) => (
                <MenuItem key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Ngày nhập kho"
            type="date"
            value={newIntake.intake_date}
            onChange={(e) => setNewIntake({ ...newIntake, intake_date: e.target.value })}
            fullWidth
            sx={{ mt: 2 }}
          />
          <Typography variant="subtitle1" sx={{ mt: 3, mb: 2 }}>
            Chi tiết nhập kho
          </Typography>
          {newIntake.details.map((detail, index) => (
            <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel>Sản phẩm</InputLabel>
                  <Select
                    value={detail.product_id}
                    onChange={(e) => handleDetailChange(index, "product_id", e.target.value)}
                  >
                    {products.map((product) => (
                      <MenuItem key={product.id} value={product.id}>
                        {product.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Số lượng"
                  type="number"
                  value={detail.quantity}
                  onChange={(e) => handleDetailChange(index, "quantity", e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Giá nhập (VNĐ)"
                  type="number"
                  value={detail.unit_price}
                  onChange={(e) => handleDetailChange(index, "unit_price", e.target.value)}
                  fullWidth
                />
              </Grid>
            </Grid>
          ))}
          <Button onClick={handleAddDetail} startIcon={<AddIcon />}>
            Thêm sản phẩm
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          {/* <Button variant="contained" onClick={handleCreateIntake}>
            Tạo phiếu
          </Button> */}
          <Button variant="contained" >
            Tạo phiếu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}