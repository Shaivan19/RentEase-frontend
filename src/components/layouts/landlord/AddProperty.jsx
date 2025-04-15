import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Typography,
  Container,
  Grid,
  Input,
  Select,
  Paper,
  Box,
  Card,
  CardContent,
  IconButton,
  Chip,
  Stack,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams, useNavigate } from "react-router-dom";

const propertyTypes = ["Apartment", "House", "Villa", "Studio", "Commercial"];
const amenitiesList = ["WiFi", "Parking", "Swimming Pool", "Gym", "Security", "Garden"];

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const AddProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [propertyData, setPropertyData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
    furnished: false,
    availableFrom: new Date(),
    amenities: [],
    images: [],
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    landArea: {
      value: "",
      unit: "sqft",
    },
    constructionYear: "",
    nearbyFacilities: [],
  });

  const areaUnits = ['sqft', 'sqm', 'acres', 'hectares'];
  const facilityTypes = [
  'School',
  'Hospital',
  'Shopping Mall',
  'Park',
  'Metro Station',
  'Bus Stop',
  'Restaurant',
  'Bank',
  'Other'
];

  const [previewImages, setPreviewImages] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddFacility = () => {
    setPropertyData(prev => ({
      ...prev,
      nearbyFacilities: [
        ...prev.nearbyFacilities,
        {
          name: '',
          distance: { value: '', unit: 'km' },
          type: 'Other'
        }
      ]
    }));
  };

  const handleRemoveFacility = (index) => {
    setPropertyData(prev => ({
      ...prev,
      nearbyFacilities: prev.nearbyFacilities.filter((_, i) => i !== index)
    }));
  };

  const handleFacilityChange = (index, field, value) => {
    setPropertyData(prev => ({
      ...prev,
      nearbyFacilities: prev.nearbyFacilities.map((facility, i) => {
        if (i === index) {
          if (field.includes('.')) {
            const [parent, child] = field.split('.');
            return {
              ...facility,
              [parent]: {
                ...facility[parent],
                [child]: value
              }
            };
          }
          return { ...facility, [field]: value };
        }
        return facility;
      })
    }));
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      alert("Landlord ID not found. Please log in again.");
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    const fetchPropertyData = async () => {
      if (id) {
        try {
          setLoading(true);
          setIsEditing(true);
          const response = await axios.get(`/properties/${id}`);
          const property = response.data;
          
          setPropertyData({
            title: property.title || "",
            description: property.description || "",
            price: property.price || "",
            location: property.location || "",
            propertyType: property.propertyType || "",
            bedrooms: property.bedrooms || "",
            bathrooms: property.bathrooms || "",
            furnished: property.furnished || false,
            availableFrom: new Date(property.availableFrom) || new Date(),
            amenities: property.amenities || [],
            address: {
              street: property.address?.street || "",
              city: property.address?.city || "",
              state: property.address?.state || "",
              zipCode: property.address?.zipCode || "",
              country: property.address?.country || "",
            },
            landArea: property.landArea || {
              value: "",
              unit: "sqft",
            },
            constructionYear: property.constructionYear || "",
            nearbyFacilities: property.nearbyFacilities || [],
          });

          if (property.images && property.images.length > 0) {
            setPreviewImages(property.images);
          }
        } catch (error) {
          console.error("Error fetching property:", error);
          setError("Failed to load property data");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPropertyData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setPropertyData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setPropertyData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e) => {
    setPropertyData({ ...propertyData, furnished: e.target.checked });
  };

  const handleAmenityChange = (e) => {
    setPropertyData({ ...propertyData, amenities: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length !== files.length) {
      alert("Some files were not images and were excluded.");
    }
    
    if (validFiles.length > 0) {
      setPropertyData(prev => ({
        ...prev,
        images: [...prev.images, ...validFiles]
      }));
      
      const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
      setPreviewImages(prev => [...prev, ...newPreviewUrls]);
    }
  };

  const removeImage = (index) => {
    setPropertyData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    return () => {
      previewImages.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewImages]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("User not found. Please log in again.");
      return;
    }

    if (propertyData.nearbyFacilities.length > 0) {
      const invalidFacilities = propertyData.nearbyFacilities.filter(
        facility => !facility.name || !facility.type || !facility.distance.value
      );
      
      if (invalidFacilities.length > 0) {
        alert("Please complete all facility details or remove incomplete entries.");
        return;
      }
    }
  

    if (!propertyData.landArea.value || !propertyData.constructionYear) {
      alert("Please fill in all required fields including land area and construction year.");
      return;
    }

    if (propertyData.nearbyFacilities.some(facility => !facility.name || !facility.distance.value)) {
      alert("Please fill in all facility details or remove incomplete entries.");
      return;
    }

    const formData = new FormData();
    
    // Basic property details
    formData.append("title", propertyData.title);
    formData.append("description", propertyData.description);
    formData.append("price", propertyData.price);
    formData.append("location", propertyData.location);
    formData.append("owner", user.userId);
    formData.append("propertyType", propertyData.propertyType);
    formData.append("bedrooms", propertyData.bedrooms);
    formData.append("bathrooms", propertyData.bathrooms);
    formData.append("furnished", propertyData.furnished.toString());
    formData.append("availableFrom", propertyData.availableFrom.toISOString().split("T")[0]);
    
    // Address
    formData.append("address[street]", propertyData.address.street);
    formData.append("address[city]", propertyData.address.city);
    formData.append("address[state]", propertyData.address.state);
    formData.append("address[zipCode]", propertyData.address.zipCode);
    formData.append("address[country]", propertyData.address.country);

    // Amenities
    formData.append("amenities", propertyData.amenities.join(','));

    // Convert landArea to area in square feet and append
    let areaInSqFt = propertyData.landArea.value;
    if (propertyData.landArea.unit === 'sqm') {
      areaInSqFt = propertyData.landArea.value * 10.764;
    } else if (propertyData.landArea.unit === 'acres') {
      areaInSqFt = propertyData.landArea.value * 43560;
    } else if (propertyData.landArea.unit === 'hectares') {
      areaInSqFt = propertyData.landArea.value * 107639;
    }
    formData.append("area", Math.round(areaInSqFt));

    // Keep the original landArea for frontend display purposes
    formData.append("landArea", JSON.stringify(propertyData.landArea));
    
    // Construction year and nearby facilities
    formData.append("constructionYear", propertyData.constructionYear);
    formData.append("nearbyFacilities", JSON.stringify(propertyData.nearbyFacilities));

    // Images
    if (propertyData.images.length > 0) {
      propertyData.images.forEach(image => {
        if (image instanceof File) {
          formData.append("images", image);
        }
      });
    }

    try {
      setLoading(true);
      let response;

      if (isEditing) {
        response = await axios.put(`/properties/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Property updated successfully!");
      } else {
        response = await axios.post("/addproperties", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Property added successfully!");
      }
      
      navigate("/landlord/properties");
    } catch (error) {
      console.error("Error saving property:", error);
      setError(error.response?.data?.error || "Error saving property. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ color: "primary.main", fontWeight: "bold" }}>
          {isEditing ? "Edit Property" : "Add New Property"}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Property Title"
                name="title"
                fullWidth
                onChange={handleChange}
                required
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                fullWidth
                multiline
                rows={4}
                onChange={handleChange}
                required
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Price"
                name="price"
                type="number"
                fullWidth
                onChange={handleChange}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: "₹",
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Location"
                name="location"
                fullWidth
                onChange={handleChange}
                required
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Address Details</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Street Address"
                name="address.street"
                fullWidth
                onChange={handleChange}
                required
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="City"
                name="address.city"
                fullWidth
                onChange={handleChange}
                required
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="State"
                name="address.state"
                fullWidth
                onChange={handleChange}
                required
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="ZIP Code"
                name="address.zipCode"
                fullWidth
                onChange={handleChange}
                required
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Country"
                name="address.country"
                fullWidth
                onChange={handleChange}
                required
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Select
                name="propertyType"
                value={propertyData.propertyType}
                fullWidth
                onChange={handleChange}
                displayEmpty
                required
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              >
                <MenuItem value="" disabled>Select Property Type</MenuItem>
                {propertyTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Available From"
                  value={propertyData.availableFrom}
                  onChange={(newValue) => setPropertyData({ ...propertyData, availableFrom: newValue })}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Bedrooms"
                name="bedrooms"
                type="number"
                fullWidth
                onChange={handleChange}
                required
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Bathrooms"
                name="bathrooms"
                type="number"
                fullWidth
                onChange={handleChange}
                required
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={propertyData.furnished}
                    onChange={handleCheckboxChange}
                    color="primary"
                  />
                }
                label="Furnished"
              />
            </Grid>
            <Grid item xs={12}>
              <Select
                multiple
                name="amenities"
                value={propertyData.amenities}
                fullWidth
                onChange={handleAmenityChange}
                displayEmpty
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              >
                <MenuItem value="" disabled>Select Amenities</MenuItem>
                {amenitiesList.map((amenity) => (
                  <MenuItem key={amenity} value={amenity}>{amenity}</MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  sx={{ borderRadius: 2 }}
                >
                  Upload Images
                  <VisuallyHiddenInput type="file" multiple onChange={handleImageChange} accept="image/*" />
                </Button>
                {previewImages.length > 0 && (
                  <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                    {previewImages.map((preview, index) => (
                      <Card key={index} sx={{ width: 150, position: "relative" }}>
                        <CardContent sx={{ p: 1 }}>
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            style={{ width: "100%", height: "100px", objectFit: "cover" }}
                          />
                          <IconButton
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 4,
                              right: 4,
                              bgcolor: "rgba(255, 255, 255, 0.8)",
                            }}
                            onClick={() => removeImage(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Land Area"
                name="landArea.value"
                type="number"
                fullWidth
                value={propertyData.landArea.value}
                onChange={handleChange}
                required
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                InputProps={{
                  endAdornment: (
                    <Select
                      value={propertyData.landArea.unit}
                      onChange={(e) => handleChange({
                        target: { name: 'landArea.unit', value: e.target.value }
                      })}
                      sx={{ ml: 1, minWidth: 80 }}
                    >
                      {areaUnits.map(unit => (
                        <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                      ))}
                    </Select>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Construction Year"
                name="constructionYear"
                type="number"
                fullWidth
                value={propertyData.constructionYear}
                onChange={handleChange}
                required
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                inputProps={{
                  min: 1800,
                  max: new Date().getFullYear()
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Nearby Facilities</Typography>
              {propertyData.nearbyFacilities.map((facility, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Facility Name"
                        fullWidth
                        value={facility.name}
                        onChange={(e) => handleFacilityChange(index, 'name', e.target.value)}
                        required
                        variant="outlined"
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        select
                        label="Facility Type"
                        fullWidth
                        value={facility.type}
                        onChange={(e) => handleFacilityChange(index, 'type', e.target.value)}
                        required
                        variant="outlined"
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                      >
                        {facilityTypes.map(type => (
                          <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Distance"
                        type="number"
                        fullWidth
                        value={facility.distance.value}
                        onChange={(e) => handleFacilityChange(index, 'distance.value', e.target.value)}
                        required
                        variant="outlined"
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                        InputProps={{
                          endAdornment: (
                            <Select
                              value={facility.distance.unit}
                              onChange={(e) => handleFacilityChange(index, 'distance.unit', e.target.value)}
                              sx={{ ml: 1, minWidth: 60 }}
                            >
                              <MenuItem value="km">km</MenuItem>
                              <MenuItem value="mi">mi</MenuItem>
                            </Select>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <IconButton 
                        onClick={() => handleRemoveFacility(index)} 
                        color="error"
                        sx={{ borderRadius: 2 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddFacility}
                variant="outlined"
                sx={{ mt: 1, borderRadius: 2 }}
              >
                Add Facility
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                size="large"
                sx={{ borderRadius: 2, py: 1.5 }}
              >
                {isEditing ? "Update Property" : "Add Property"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default AddProperty;