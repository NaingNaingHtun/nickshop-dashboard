import React, { useState, useEffect } from "react";
import "./addProduct.scss";
import SideBar from "../../components/SideBar/SideBar";
import NavBar from "../../components/NavBar/NavBar";
import { HexColorPicker } from "react-colorful";
import Multiselect from "multiselect-react-dropdown";
import CloseIcon from "@mui/icons-material/Close";
import { storage } from "../../firebase";
import { ref } from "firebase/storage";
import { uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { isAdmin } from "../../authenticateUser";
import { CircularProgress } from "@mui/material";
import api from "../../api";
import CircularProgressWithLabel from "../../components/CircularProgressWithLabel/CircularProgressWithLabel";
import { useParams, useNavigate } from "react-router-dom";
const options = [
  { name: "Hat", value: "hat", id: 0 },
  { name: "Glasses", value: "glasses", id: 1 },
  { name: "Coat", value: "coat", id: 2 },
  { name: "Shirt", value: "shirt", id: 3 },
  { name: "Short Sleeve", value: "short sleeve", id: 4 },
  { name: "Long Sleeve", value: "long sleeve", id: 5 },
  { name: "Pant", value: "pant", id: 6 },
  { name: "Short Pant", value: "short pant", id: 7 },
  { name: "Long Pant", value: "long pant", id: 8 },
  { name: "Shoe", value: "shoe", id: 9 },
  { name: "Sneaker", value: "sneaker", id: 10 },
  { name: "Sweater", value: "sweater", id: 11 },
];

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const sizes = ["xsm", "sm", "md", "lg", "xlg"];
const AddProduct = () => {
  const navigate = useNavigate();
  isAdmin(navigate);
  const { id } = useParams();
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [title, setTitle] = useState("");
  const [currentColor, setCurrentColor] = useState("#ffffff");
  const [colors, setColors] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [chosenSizes, setChosenSizes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [description, setDescription] = useState("");
  const [genders, setGenders] = useState([]);
  const [price, setPrice] = useState();
  const [inStock, setInStock] = useState(true);
  const [photo, setPhoto] = useState();
  const [photoUploading, setPhotoUploading] = useState(false);
  const [productUploading, setProductUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [productFetchingError, setProductFetchingError] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const [progress, setProgress] = useState(0);

  //we don't need to disabled the button if we don't have a photo when we are updating the product
  const disabledButton = id
    ? !(
        title &&
        colors &&
        chosenSizes &&
        categories &&
        description &&
        genders &&
        price
      )
    : !(
        title &&
        colors &&
        chosenSizes &&
        categories &&
        description &&
        genders &&
        price &&
        photo
      );

  const clearStates = () => {
    setTitle("");
    setCurrentColor("#ffffff");
    setColors([]);
    setChosenSizes([]);
    setGenders([]);
    setPrice(0);
    setCategories([]);
    setDescription("");
    setPhoto(null);
    setInStock(true);
    setPhotoUrl("");
    setCategoryOptions(options);
  };

  const updateProduct = async (newContent) => {
    setProductUploading(true);
    await api
      .put(
        `/products/${id}`,
        {
          content: newContent,
        },
        {
          headers: {
            authorization: "Bearer " + user.accessToken,
          },
        }
      )
      .then(() => {
        setProductUploading(false);
        setUploadSuccess(true);
        setUploadError(false);
        clearStates();
      })
      .catch((err) => {
        console.log(err);
        setUploadError(true);
        setUploadSuccess(false);
        setProductUploading(false);
      });
  };

  const upload = async () => {
    if (id && photo) {
      //photo will be updating
      const imageRef = ref(storage, "images/" + photo.name);
      const uploadTask = uploadBytesResumable(imageRef, photo);
      setPhotoUploading(true);
      setProductUploading(true);

      uploadTask.on("state_changed", (snapshot) => {
        const progressCounter = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progressCounter);
        if (progressCounter === 100) {
          //image is uploaded successfully,
          setPhotoUploading(false);

          setTimeout(() => {
            //then get back the image url
            getDownloadURL(imageRef)
              .then((url) => {
                const newProduct = {
                  title,
                  desc: description,
                  image: url,
                  for: genders,
                  category: categories,
                  colors,
                  sizes: chosenSizes,
                  price: price,
                  inStock,
                };
                updateProduct(newProduct);
              })
              .catch((err) => {
                console.log(err);
                setUploadError(true);
                setUploadSuccess(false);
                setProductUploading(false);
              });
          }, 500);
        }
      });
    }

    if (id && !photo) {
      //photo is the same photo, then just update the other properties
      updateProduct({
        title,
        desc: description,
        for: genders,
        category: categories,
        colors,
        sizes: chosenSizes,
        price: price,
        inStock,
      });
    }

    if (!id && photo) {
      //photo is for creating a new product
      const imageRef = ref(storage, "images/" + photo.name);
      const uploadTask = uploadBytesResumable(imageRef, photo);
      setPhotoUploading(true);
      setProductUploading(true);
      uploadTask.on("state_changed", (snapshot) => {
        const progressCounter = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progressCounter);
        if (progressCounter === 100) {
          //image is uploaded successfully,
          setPhotoUploading(false);

          setTimeout(() => {
            //then get back the image url
            getDownloadURL(imageRef)
              .then((url) => {
                const newProduct = {
                  title,
                  desc: description,
                  image: url,
                  for: genders,
                  category: categories,
                  colors,
                  sizes: chosenSizes,
                  price: price,
                  inStock,
                };

                api
                  .post("/products/", newProduct, {
                    headers: {
                      authorization: `Bearer ${user.accessToken}`,
                    },
                  })
                  .then((res) => {
                    setProductUploading(false);
                    setUploadSuccess(true);
                    console.log(res.data);
                    clearStates();
                  })
                  .catch((err) => {
                    console.log(err);
                    setProductUploading(false);
                    setUploadError(true);
                  });
              })
              .catch((err) => {
                console.log(err);
                setUploadError(true);
                setUploadSuccess(false);
                setProductUploading(false);
              });
          }, 500);
        }
      });
    }
  };

  //every time photo changes, we need to update the photourl
  useEffect(() => {
    if (photo) {
      setPhotoUrl(URL.createObjectURL(photo));
    }
  }, [photo]);
  //we gonna fetch the product when we have the id
  useEffect(() => {
    if (id) {
      const getProduct = async () => {
        await api
          .get(`/products/find/${id}`)
          .then(({ data }) => {
            setTitle(data.title);
            setDescription(data.desc);
            setPrice(data.price);
            setGenders(data.for);
            setInStock(data.inStock);
            setChosenSizes(data.sizes);
            setCategories(data.category);
            setColors(data.colors);
            setPhotoUrl(data.image);
            setProductFetchingError(false);
          })
          .catch((err) => {
            console.log(err);
            setProductFetchingError(true);
          });
      };

      getProduct();
    }
  }, [id]);
  useEffect(() => {
    //hide the upload success message after 3 seconds
    if (uploadSuccess) {
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    }
  }, [uploadSuccess]);

  const reset = () => {
    clearStates();
  };

  const cancel = () => {
    clearStates();
    navigate("/products");
  };
  const addColor = () => {
    const newColors = [...colors];
    newColors.push(currentColor);
    const uniqueColors = Array.from(new Set(newColors)); //making unique colors
    setColors(uniqueColors);
  };
  const addSize = (e, s) => {
    if (e.target.checked) {
      const newSizes = [...chosenSizes];
      newSizes.push(s);
      setChosenSizes(newSizes);
    } else {
      setChosenSizes(chosenSizes.filter((siz) => siz !== s));
    }
  };
  const addCategory = (selectedValues, selectedOption) => {
    setCategories([...categories, selectedOption.value]);
  };
  const removeCategory = (selectedValues, removeOption) => {
    setCategories((prevCategories) =>
      prevCategories.filter((option) => option !== removeOption.value)
    );
  };
  const addGender = (e) => {
    if (e.target.checked) {
      setGenders([...genders, e.target.value]);
    } else {
      setGenders((prevGenders) => {
        return prevGenders.filter((g) => g !== e.target.value);
      });
    }
  };
  return (
    <div className="addProduct">
      <SideBar />
      <div className="add-product-container">
        <NavBar />
        <div className="wrapper">
          {productFetchingError && (
            <div className="product-getting-error">Couldn't get product.</div>
          )}
          <div className="add-container">
            <div className="left">
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                className="title-input"
                value={title ? title : ""}
                onChange={(e) => setTitle(e.target.value)}
              />
              <label htmlFor="color">Color:</label>
              <div className="color-picker">
                <HexColorPicker
                  color={currentColor}
                  onChange={setCurrentColor}
                />
                <div className="current-color-container">
                  <h3>CurrentColor</h3>
                  <div
                    className="current-color"
                    style={{ backgroundColor: currentColor }}
                  ></div>
                  <button className="add" onClick={addColor}>
                    Add
                  </button>
                </div>
              </div>
              <div className="chosenColors">
                {colors.length === 0 ? (
                  <div className="no-color">No Colors</div>
                ) : (
                  colors.map((color) => (
                    <div
                      className="color"
                      style={{ backgroundColor: color }}
                      key={color}
                    >
                      <CloseIcon
                        className="close-icon"
                        fontSize="small"
                        onClick={() =>
                          setColors(colors.filter((clr) => clr !== color))
                        }
                      />
                    </div>
                  ))
                )}
              </div>
              <label htmlFor="sizes">Size:</label>
              <div id="sizes" className="sizes">
                {sizes.map((size) => (
                  <div className="size" key={size}>
                    <input
                      type="checkbox"
                      className="checkbox"
                      value={size}
                      checked={chosenSizes.includes(size)}
                      onChange={(e) => addSize(e, size)}
                    />
                    <label htmlFor={size}>{size}</label>
                  </div>
                ))}
              </div>
              <label htmlFor="categories">Categories:</label>
              <Multiselect
                options={categoryOptions}
                displayValue="name"
                selectedValues={
                  categories.length !== 0
                    ? categories.map((category) => ({
                        name: capitalize(category),
                        value: category,
                      }))
                    : []
                }
                placeholder="Choose a category"
                onSelect={addCategory}
                style={{ inputField: { margin: "5px", fontSize: "16px" } }}
                onRemove={removeCategory}
              />
              <label htmlFor="gender">Gender:</label>
              <div id="genders" className="genders">
                {["men", "women"].map((gender) => (
                  <div className="gender" id="gender" key={gender}>
                    <input
                      type="checkbox"
                      className="checkbox"
                      id={gender}
                      value={gender}
                      checked={genders.includes(gender)}
                      onChange={addGender}
                    />
                    <label htmlFor={gender}>{gender}</label>
                  </div>
                ))}
              </div>
              <label htmlFor="price">Price:</label>
              <input
                className="price-input"
                type="number"
                min={0}
                value={price ? price : 0}
                onChange={(e) => setPrice(e.target.value)}
              />
              <label htmlFor="instock">InStock:</label>
              <div className="instock-container">
                <div className="yes-container">
                  <input
                    type="radio"
                    name="yes"
                    id="yes"
                    checked={inStock}
                    onChange={(e) => setInStock(true)}
                  />
                  <label htmlFor="yes">Yes</label>
                </div>
                <div className="no-container">
                  <input
                    type="radio"
                    name="no"
                    id="no"
                    checked={!inStock}
                    onChange={(e) => setInStock(!e.target.checked)}
                  />
                  <label htmlFor="no">No</label>
                </div>
              </div>
            </div>

            <div className="right">
              <label htmlFor="desc">Descption:</label>
              <textarea
                className="desc"
                placeholder="Add Description"
                value={description ? description : ""}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
              <div className="file-container">
                <span>Photo:</span>
                <label htmlFor="file" className="upload-btn">
                  Upload
                </label>
                <input
                  type="file"
                  id="file"
                  name="file"
                  style={{ display: "none" }}
                  onChange={(e) => setPhoto(e.target.files[0])}
                />
              </div>
              <div className="photo-container">
                {photoUrl ? (
                  <img src={photoUrl} alt="Product" className="photo" />
                ) : (
                  <div className="no-photo">No Image</div>
                )}
                {photoUploading && (
                  <div className="uploading">
                    <CircularProgressWithLabel value={progress} />
                    <span style={{ color: "blue" }}>Image Uploading...</span>
                  </div>
                )}
              </div>
              <div className="actions">
                <div className="actions-left ">
                  <button className="reset-btn" onClick={reset}>
                    Clear All
                  </button>
                </div>
                <div className="actions-right">
                  <button className="cancel-btn" onClick={cancel}>
                    Cancel
                  </button>
                  <button
                    className="create-btn"
                    onClick={upload}
                    disabled={disabledButton}
                  >
                    {id ? "Update" : "Create"}
                  </button>
                </div>
              </div>
              <div>
                {productUploading && (
                  <div className="product-upload">
                    <CircularProgress /> Uploading...
                  </div>
                )}
              </div>

              {uploadSuccess && (
                <div className="upload-success">Uploaded Successfully</div>
              )}
              {uploadError && (
                <div className="upload-error">Couldn't upload. Try again</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
