import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions, Button, Box, CircularProgress, Typography
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import { useDispatch } from 'react-redux';
import { showAlert } from './../../store/reducers/alert';
import { useUploadProductImageMutation } from './../../services/productApi';
import Env from './../../services/config';

const ProductImageUploadDialog = ({ open, product, onClose, onUploadSuccess }) => {
    const dispatch = useDispatch();
    const [uploadProductImage, { isLoading: isUploading }] = useUploadProductImageMutation();

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    const imageBaseUrl = Env.appUrl || Env.baseurl?.replace(/\/api\/?$/, '') || '';

    useEffect(() => {
        if (open && product) {
            if (product.imageUrl) {
                setPreviewUrl(`${imageBaseUrl}/images/products/${product.imageUrl}`);
            } else {
                setPreviewUrl('');
            }
            setSelectedFile(null);
        }
    }, [open, product, imageBaseUrl]);

    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !product) return;

        try {
            const result = await uploadProductImage({
                productId: product.productID,
                file: selectedFile,
            }).unwrap();

            dispatch(showAlert({
                open: true,
                message: 'Image uploaded successfully!',
                severity: 'success'
            }));

            if (onUploadSuccess) onUploadSuccess(result.imageUrl);
            onClose();
        } catch (error) {
            const message = error?.data || 'Upload failed. Please try again.';
            dispatch(showAlert({
                open: true,
                message: typeof message === 'string' ? message : 'Upload failed.',
                severity: 'error'
            }));
        }
    };

    const isExistingImage = previewUrl && !selectedFile;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Upload Product Image</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Select an image file for "{product?.name || 'product'}". Allowed formats: JPG, PNG, GIF (max 5MB).
                </DialogContentText>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                    {previewUrl ? (
                        <>
                            {isExistingImage && (
                                <Typography variant="caption" color="textSecondary" sx={{ mb: 1 }}>
                                    Current Image
                                </Typography>
                            )}
                            <Box
                                sx={{
                                    width: 200,
                                    height: 200,
                                    border: '1px solid #ddd',
                                    borderRadius: 1,
                                    overflow: 'hidden',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bgcolor: '#fafafa',
                                    mb: 2
                                }}
                            >
                                <img
                                    src={previewUrl}
                                    alt={product?.name || 'Product image'}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                    }}
                                />
                            </Box>
                        </>
                    ) : (
                        <Box
                            sx={{
                                width: 200,
                                height: 200,
                                bgcolor: 'grey.200',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 1,
                                mb: 2
                            }}
                        >
                            <ImageIcon fontSize="large" color="disabled" />
                        </Box>
                    )}
                    <Button variant="outlined" component="label" sx={{ mt: 1 }}>
                        Choose Image
                        <input type="file" accept="image/*" hidden onChange={handleFileChange} />
                    </Button>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={isUploading}>Cancel</Button>
                <Button
                    onClick={handleUpload}
                    variant="contained"
                    disabled={!selectedFile || isUploading}
                >
                    {isUploading ? <CircularProgress size={24} /> : 'Upload'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProductImageUploadDialog;