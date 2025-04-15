import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

const propertyTypes = ["Apartment", "House", "Villa", "Studio", "Commercial"];

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [open, setOpen] = useState(false);
  const [newProperty, setNewProperty] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
    furnished: false,
    availableFrom: "",
    images: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProperty({ ...newProperty, [name]: value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
    setNewProperty({ ...newProperty, images: files });
  };

  const handleAddProperty = () => {
    setProperties([...properties, { ...newProperty, id: properties.length + 1 }]);
    setOpen(false);
    setNewProperty({
      title: "",
      description: "",
      price: "",
      location: "",
      propertyType: "",
      bedrooms: "",
      bathrooms: "",
      furnished: false,
      availableFrom: "",
      images: [],
    });
  };

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        My Properties
      </Typography>

      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Add New Property
      </Button>

      {/* Property List */}
      <Grid container spacing={3} mt={2}>
        {properties.map((property, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card>
              {property.images.length > 0 && (
                <CardMedia component="img" height="200" image={property.images[0]} alt={property.title} />
              )}
              <CardContent>
                <Typography variant="h6" fontWeight={500}>
                  {property.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {property.location} - {property.propertyType}
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  ₹{property.price}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add Property Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add New Property</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="normal" label="Title" name="title" value={newProperty.title} onChange={handleChange} />
          <TextField fullWidth margin="normal" label="Description" name="description" value={newProperty.description} onChange={handleChange} multiline rows={3} />
          <TextField fullWidth margin="normal" label="Price" name="price" type="number" value={newProperty.price} onChange={handleChange} />
          <TextField fullWidth margin="normal" label="Location" name="location" value={newProperty.location} onChange={handleChange} />
          <TextField fullWidth select margin="normal" label="Property Type" name="propertyType" value={newProperty.propertyType} onChange={handleChange}>
            {propertyTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
          <TextField fullWidth margin="normal" label="Bedrooms" name="bedrooms" type="number" value={newProperty.bedrooms} onChange={handleChange} />
          <TextField fullWidth margin="normal" label="Bathrooms" name="bathrooms" type="number" value={newProperty.bathrooms} onChange={handleChange} />
          <TextField fullWidth margin="normal" label="Available From" name="availableFrom" type="date" value={newProperty.availableFrom} onChange={handleChange} />
          <Button component="label" variant="contained" startIcon={<AddPhotoAlternateIcon />} fullWidth sx={{ mt: 2 }}>
            Upload Images
            <input type="file" multiple hidden onChange={handleImageUpload} />
          </Button>
          {newProperty.images.length > 0 && (
            <Box mt={2}>
              {newProperty.images.map((img, i) => (
                <img key={i} src={img} alt="Preview" width={80} style={{ marginRight: 10, borderRadius: 5 }} />
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddProperty} variant="contained" color="primary">
            Add Property
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyProperties;
