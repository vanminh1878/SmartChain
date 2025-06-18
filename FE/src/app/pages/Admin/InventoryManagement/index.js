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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchGet, fetchPost, fetchPut } from "../../../lib/httpHandler";
import SearchIcon from "@mui/icons-material/Search";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";
import { Avatar } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddStockIntake from "../../../components/Admin/InventoryManagement/AddStockIntake/AddStockIntake";
import DetailProduct from "../../../components/Admin/InventoryManagement/DetailProduct/DetailProduct.jsx";
import { BE_ENPOINT } from "../../../lib/httpHandler";

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

// Component chi tiết phiếu nhập kho
const DetailStockIntake = ({ open, onClose, intake }) => {
  const [status, setStatus] = useState(intake?.status || 0);
  const [detailsData, setDetailsData] = useState([]);

  useEffect(() => {
    if (intake?.status != null) {
      setStatus(Number(intake.status));
    }
  }, [intake]);

  useEffect(() => {
    if (!intake?.stockIntakeDetails?.length) {
      setDetailsData([]);
      return;
    }

const fetchDetails = async () => {
  try {
    const detailsWithNames = await Promise.all(
      intake.stockIntakeDetails.map(async (detail) => {
        let supplierName = "Không xác định";
        let productName = "Không xác định";
        let storeName = "Không xác định";

        await Promise.all([
          fetchGet(`/Suppliers/${detail.supplierId}`, (res) => {
            console.log("hehehh Supplier:", res);
            supplierName = res?.name || "Không xác định";
          }, (err) => {
            console.error("Error fetching supplier:", err);
          }),
          fetchGet(`/Products/${detail.productId}`, (res) => {
            console.log("hehehh Product:", res);
            productName = res?.name || "Không xác định";
          }, (err) => {
            console.error("Error fetching product:", err);
          }),
          fetchGet(`/Stores/${detail.storeId}`, (res) => {
            console.log("hehehh Store:", res);
            storeName = res?.name || "Không xác định";
          }, (err) => {
            console.error("Error fetching store:", err);
          }),
        ]);

        return {
          ...detail,
          supplierName,
          productName,
          storeName,
        };
      })
    );
        setDetailsData(detailsWithNames);
        console.log("đây nè:", detailsWithNames)
      } catch (error) {
        console.error("Error fetching details:", error);
        toast.error("Lỗi khi lấy thông tin chi tiết");
      }
    };

    fetchDetails();
  }, [intake]);
useEffect(() => {
  console.log("Updated detailsData:", detailsData);
}, [detailsData]);
  const handleSave = useCallback(() => {
    if (!intake?.stockIntakeId) {
      toast.error("Không tìm thấy ID phiếu nhập kho");
      return;
    }

    fetchPut(
      `/Inventory/${intake.stockIntakeId}/status`,
      { Status: status },
      (res) => {
        toast.success("Cập nhật trạng thái thành công");
        onClose();
      },
      (err) => {
        console.error("Lỗi khi cập nhật trạng thái:", err);
        toast.error("Lỗi khi cập nhật trạng thái");
      }
    );
  }, [intake, status, onClose]);

  if (!intake) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Chi tiết phiếu nhập kho
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <Typography><strong>ID:</strong> {intake.stockIntakeId}</Typography>
          <Typography>
            <strong>Ngày nhập:</strong>{" "}
            {intake.intakeDate
              ? new Date(intake.intakeDate).toLocaleString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
              : "Không xác định"}
          </Typography>
          <Typography><strong>Người tạo:</strong> {intake.created_By_Name}</Typography>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(Number(e.target.value))}
              label="Trạng thái"
            >
              <MenuItem value={0}>Pending</MenuItem>
              <MenuItem value={1}>Approved</MenuItem>
              <MenuItem value={2}>Intaked</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Chi tiết nhập kho
          </Typography>
          <Table sx={{ minWidth: 650 }} size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nhà cung cấp</TableCell>
                <TableCell>Sản phẩm</TableCell>
                <TableCell>Cửa hàng</TableCell>
                <TableCell align="right">Biên lợi nhuận</TableCell>
                <TableCell align="right">Số lượng</TableCell>
                <TableCell align="right">Đơn giá</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {detailsData.map((detail) => (
                <TableRow key={detail.id}>
                  <TableCell>{detail.supplierName}</TableCell>
                  <TableCell>{detail.productName}</TableCell>
                  <TableCell>{detail.storeName}</TableCell>
                  <TableCell align="right">
                    {(detail.profit_margin * 100).toFixed(2)}%
                  </TableCell>
                  <TableCell align="right">{detail.quantity}</TableCell>
                  <TableCell align="right">
                    {Number(detail.unitPrice).toLocaleString("vi-VN")} VNĐ
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">Đóng</Button>
        <Button onClick={handleSave} variant="contained">Lưu</Button>
      </DialogActions>
    </Dialog>
  );
};

// Component chi tiết phiếu đặt hàng
const DetailPurchaseOrder = ({ open, onClose, order }) => {
  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Chi tiết phiếu đặt hàng
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <Typography><strong>Nhà cung cấp:</strong> {order.supplier || "Không xác định"}</Typography>
          <Typography>
            <strong>Ngày nhập:</strong>{" "}
            {order.intakeDate
              ? new Date(order.intakeDate).toLocaleString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
              : "Không xác định"}
          </Typography>
          <Typography>
            <strong>Tổng tiền:</strong>{" "}
            {order.totalAmount != null
              ? `${Number(order.totalAmount).toLocaleString("vi-VN")} VNĐ`
              : "0 VNĐ"}
          </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>Chi tiết cửa hàng</Typography>
          <Table sx={{ minWidth: 650 }} size="small">
            <TableHead>
              <TableRow>
                <TableCell>Cửa hàng</TableCell>
                <TableCell>Sản phẩm</TableCell>
                <TableCell align="right">Tổng tiền</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.purchaseOrders?.map((po, index) => (
                <TableRow key={index}>
                  <TableCell>{po.storeName || "Không xác định"}</TableCell>
                  <TableCell>
                    {po.products?.map((product, idx) => (
                      <Typography key={idx} variant="body2">
                        {product.productName || "Không xác định"} (Số lượng: {product.quantity || 0})
                      </Typography>
                    ))}
                  </TableCell>
                  <TableCell align="right">
                    {po.totalAmountPerStore != null
                      ? `${Number(po.totalAmountPerStore).toLocaleString("vi-VN")} VNĐ`
                      : "0 VNĐ"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default function InventoryManagement() {
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [stockIntakes, setStockIntakes] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [productSearchText, setProductSearchText] = useState("");
  const [intakeSearchText, setIntakeSearchText] = useState("");
  const [orderSearchText, setOrderSearchText] = useState("");
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingAllProducts, setIsLoadingAllProducts] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedIntake, setSelectedIntake] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

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
            description: item.moTa || "Không có mô tả",
            category: item.danhMuc || "Không xác định",
            supplier: item.nhaCungCap || "Không xác định",
            store: item.cuaHang || "Không xác định",
            unit_price: Number(item.giaNhap) || 0,
            price: Number(item.giaBan) || 0,
            stockQuantity: Number(item.tonKho) || 0,
            image: item.hinhAnh || null,
          }));
        console.log("validatedProducts: ", validatedProducts);
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

  const fetchAllProducts = useCallback(() => {
    setIsLoadingAllProducts(true);
    fetchGet(
      "/Products",
      (res) => {
        console.log("All products fetched:", res);
        const productList = Array.isArray(res) ? res : [];
        const validatedAllProducts = productList
          .filter((item) => item && typeof item === "object" && item.id)
          .map((item) => ({
            id: item.id,
            name: item.name || "Không xác định",
            description: item.description || "Không có mô tả",
            category: item.category || "Không xác định",
            price: Number(item.price) || 0,
            stockQuantity: Number(item.stockQuantity) || 0,
            image: item.image || null,
          }));
        setAllProducts(validatedAllProducts);
        setIsLoadingAllProducts(false);
      },
      (err) => {
        console.error("Fetch products error:", err);
        toast.error("Lỗi khi lấy danh sách sản phẩm.");
        setAllProducts([]);
        setIsLoadingAllProducts(false);
      },
      () => console.log("Fetch products completed")
    );
  }, []);

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
            id: item.id || item.supplierId || `temp-id-${index}`,
            supplierId: item.supplierId,
            supplier: item.supplier || "Không xác định",
            intakeDate: item.intakeDate || "Không xác định",
            totalAmount: Number(item.totalAmount) || 0,
            purchaseOrders: item.purchaseOrders || [],
          }));
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

  const handleEditProduct = useCallback((productId) => {
    const product = allProducts.find((p) => p.id === productId);
    if (product) {
      setSelectedProduct(product);
    } else {
      toast.error("Không tìm thấy sản phẩm để chỉnh sửa");
    }
  }, [allProducts]);

  const handleViewIntake = useCallback((intakeId) => {
    const intake = stockIntakes.find((i) => i.stockIntakeId === intakeId);
    if (intake) {
      setSelectedIntake(intake);
    } else {
      toast.error("Không tìm thấy phiếu nhập kho");
    }
  }, [stockIntakes]);

  const handleUpdateStatus = useCallback((intakeId, newStatus) => {
    fetchPut(
      `/Inventory/${intakeId}/status`,
      { Status: Number(newStatus) },
      () => {
        toast.success("Cập nhật trạng thái thành công");
        setStockIntakes((prev) =>
          prev.map((intake) =>
            intake.stockIntakeId === intakeId ? { ...intake, status: Number(newStatus) } : intake
          )
        );
      },
      (err) => {
        console.error("Lỗi khi cập nhật trạng thái:", err);
        toast.error("Lỗi khi cập nhật trạng thái");
      }
    );
  }, []);

  const handleViewOrder = useCallback((orderId) => {
    const order = purchaseOrders.find((o) => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
    } else {
      toast.error("Không tìm thấy phiếu đặt hàng");
    }
  }, [purchaseOrders]);

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    const validProducts = products.filter((item) => item && item.id);
    if (!productSearchText.trim()) return validProducts;
    const lowercasedSearch = productSearchText.toLowerCase();
    return validProducts.filter((item) => item.name?.toLowerCase().includes(lowercasedSearch));
  }, [products, productSearchText]);

  const filteredAllProducts = useMemo(() => {
    if (!Array.isArray(allProducts)) return [];
    const validProducts = allProducts.filter((item) => item && item.id);
    if (!productSearchText.trim()) return validProducts;
    const lowercasedSearch = productSearchText.toLowerCase();
    return validProducts.filter((item) => item.name?.toLowerCase().includes(lowercasedSearch));
  }, [allProducts, productSearchText]);

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
    fetchAllProducts();
  }, [fetchStores, fetchSuppliers, fetchStockIntakes, fetchPurchaseOrders, fetchAllProducts]);

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
      field: "price",
      headerName: "Giá bán",
      width: 150,
      renderCell: (params) => {
        return params.row.price != null
          ? `${Number(params.row.price).toLocaleString("vi-VN")} VNĐ`
          : "0 VNĐ";
      },
    },
    {
      field: "stockQuantity",
      headerName: "Tồn kho",
      width: 120,
      renderCell: (params) => {
        return params.row.stockQuantity != null
          ? `${Number(params.row.stockQuantity)} cái`
          : "0 cái";
      },
    },
  ];

  const intakeColumns = [
    { field: "stockIntakeId", headerName: "ID", width: 250 },
    {
      field: "intakeDate",
      headerName: "Ngày nhập",
      width: 180,
      renderCell: (params) => {
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
    {
      field: "status",
      headerName: "Trạng thái",
      width: 150,
      renderCell: (params) => (
        <FormControl fullWidth variant="outlined" sx={{ mt: 0.625 }} size="small">
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={params.row.status ?? 0}
            onChange={(e) => handleUpdateStatus(params.row.stockIntakeId, e.target.value)}
            label="Trạng thái"
          >
            <MenuItem value={0}>Pending</MenuItem>
            <MenuItem value={1}>Approved</MenuItem>
            <MenuItem value={2}>Intaked</MenuItem>
          </Select>
        </FormControl>
      ),
    },
    {
      field: "actions",
      headerName: "Thao tác",
      width: 200,
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => handleViewIntake(params.row.stockIntakeId)}
          title="Xem chi tiết"
        >
          <InfoIcon />
        </IconButton>
      ),
    },
  ];

  const orderColumns = [
    { field: "supplier", headerName: "Nhà cung cấp", width: 300 },
    {
      field: "intakeDate",
      headerName: "Ngày nhập",
      width: 300,
      renderCell: (params) => {
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
        return params.row.totalAmount != null
          ? `${Number(params.row.totalAmount).toLocaleString("vi-VN")} VNĐ`
          : "0 VNĐ";
      },
    },
    {
      field: "actions",
      headerName: "Thao tác",
      width: 100,
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => handleViewOrder(params.row.id)}
          title="Xem chi tiết"
        >
          <InfoIcon />
        </IconButton>
      ),
    },
  ];

  const manageProductColumns = [
    {
      field: "image",
      headerName: "Ảnh",
      width: 100,
      renderCell: (params) => (
        <Avatar
          src={params.row.image ? `${BE_ENPOINT}/api/asset/view-image/${params.row.image}` : null}
          alt={params.row.name}
          sx={{ width: 40, height: 40 }}
          variant="square"
        >
          {params.row.name ? params.row.name[0].toUpperCase() : "A"}
        </Avatar>
      ),
    },
    { field: "name", headerName: "Tên", width: 200 },
    { field: "description", headerName: "Mô tả", width: 250 },
    {
      field: "price",
      headerName: "Giá",
      width: 150,
      renderCell: (params) => {
        return params.row.price != null
          ? `${Number(params.row.price).toLocaleString("vi-VN")} VNĐ`
          : "0 VNĐ";
      },
    },
    {
      field: "stockQuantity",
      headerName: "Tồn kho",
      width: 120,
      renderCell: (params) => {
        return params.row.stockQuantity != null
          ? `${Number(params.row.stockQuantity)} cái`
          : "0 cái";
      },
    },
    {
      field: "actions",
      headerName: "Thao tác",
      width: 150,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <DetailProduct item={params.row} setListProducts={setAllProducts} setSelectedProduct={setSelectedProduct} />
        </Box>
      ),
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
        rowHeight={80}
        sx={{ borderLeft: 0, borderRight: 0, borderRadius: 0, mb: 4, '& .MuiDataGrid-row': { height: 80 } }}
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
          sx={{ borderLeft: 0, borderRight: 0, borderRadius: 0, mb: 4 }}
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
      <Typography variant="h5" sx={{ mb: 2 }}>
        Quản lý sản phẩm
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
      </Box>
      {isLoadingAllProducts ? (
        <Typography>Đang tải dữ liệu sản phẩm...</Typography>
      ) : (
        <DataGrid
          sx={{ borderLeft: 0, borderRight: 0, borderRadius: 0 }}
          rows={filteredAllProducts}
          columns={manageProductColumns}
          getRowId={(row) => row.id}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 10 } },
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
      <DetailStockIntake
        open={!!selectedIntake}
        onClose={() => setSelectedIntake(null)}
        intake={selectedIntake}
      />
      <DetailPurchaseOrder
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
      />
    </Box>
  );
}