import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Container, TextField, Button, Box, Typography, Paper } from "@mui/material";

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    console.log("Submitting Login Data:", data);
    
    try {
      const response = await axios.post("/users/login", data);
      console.log("Response from Backend:", response.data);
      
      if (response.status === 200 && response.data?.data?.username) {
        const userData = response.data?.data;
        const userType = response.data?.userType?.toLowerCase();

        // Store user data directly in localStorage
        localStorage.setItem("user", JSON.stringify({
          userId: userData.userId,
          username: userData.username,
          userType: userType,
          isLoggedIn: true,
          token: response.data?.token
        }));

        toast.success(`Welcome ${userData.username}!`, {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });

        setTimeout(() => {
          // Direct role-based navigation
          if (userType === "tenant") {
            navigate("/tenant/dashboard");
          } else if (userType === "landlord") {
            navigate("/landlord/dashboard");
          } else if (userType === "admin") {
            navigate("/user");
          } else {
            navigate("/home");
          }
        }, 2000);
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(error.response?.data?.message || "Invalid credentials! Please try again.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('https://github.com/Shaivan19/mybackgrounds/blob/main/webbackground_optimized.png?raw=true')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100vw",
        paddingTop: "80px",
      }}
    >
      <ToastContainer />
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <Paper
          elevation={10}
          sx={{
            padding: 5,
            borderRadius: 4,
            textAlign: "center",
            background: "rgba(255, 255, 255, 0.9)",
            width: "400px",
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Login
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              {...register("password", { required: "Password is required" })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <Typography
              variant="body2"
              sx={{ textAlign: "right", mt: 1, cursor: "pointer", color: "#0072ff" }}
              onClick={() => navigate("/reset-password")}
            >
              Forgot Password?
            </Typography>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, backgroundColor: "#16a34a", "&:hover": { backgroundColor: "#128c3c" }, fontSize: "18px", padding: "12px" }}
              >
                Login
              </Button>
            </motion.div>
          </Box>

          <Typography variant="body2" sx={{ mt: 3 }}>
            New to RentEase?{' '}
            <motion.span
              style={{ color: "#0072ff", cursor: "pointer", fontWeight: "bold" }}
              whileHover={{ scale: 1.1 }}
              onClick={() => navigate("/signup")}
            >
              Register here
            </motion.span>
          </Typography>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default Login;