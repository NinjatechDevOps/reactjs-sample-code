import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fabric } from "fabric";
import Loader from "../components/Loader";
import {
  SET_CANVAS_JSON,
  SET_CANVAS_JSON_IMAGE,
  SET_CANVAS_LOADING,
} from "../store/actions";

const imageFilters = {
  3: new fabric.Image.filters.Sepia(),
  19: new fabric.Image.filters.BlackWhite(),
};

export const CustomFabric = forwardRef((props, ref) => {
  const { id, onActiveCanvasUpdate, onClearSelection, template, currentSlide } =
    props;
  const dispatch = useDispatch();
  const { width, height } = template;
  const canvasTemplateImage = useSelector((state) => state.canvasTemplateImage);
  const canvasTemplateJSON = useSelector((state) => state.canvasTemplateJSON);
  const [canvas, setCanvas] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const [canvasData, setCanvasData] = useState(template.canvasData);
  const [previousSlide, setPreviousSlide] = useState(0);

  useEffect(() => {
    if (!canvas) {
      return;
    }
    canvas.renderAll();
    canvas.on("selection:created", function (options) {
      // console.log("selection:created", options);
      onUpdateCanvas();
    });
    canvas.on("selection:updated", function (options) {
      // console.log("selection:updated", options);
      onUpdateCanvas();
    });
    canvas.on("selection:cleared", function (options) {
      // console.log("selection:cleared", options);
      onClearSelection();
    });
    canvas.on("mouse:down", function (options) {
      // console.log("mouse:down", options);
      if (!options.target) return;
      if (options && options.target && options.target.type == "textbox") {
        canvas.setActiveObject(options.target);
        canvas.renderAll();
        setCanvas(canvas);
        onUpdateCanvas();
      }
    });
    canvas.on("text:changed", function (options) {
      // console.log("text:changed", options);
      onUpdateCanvas();
    });
    canvas.on("object:moving", function (options) {
      // console.log("object:moving", options);
      onObjectMoving(options);
    });
  }, [canvas]);

  useEffect(() => {
    // console.log("currentSlide useEffect", currentSlide);
    const canvasJSON = canvasData[currentSlide];
    if (!canvasJSON || isInitialLoad) return;
    updateJSON();
  }, [currentSlide]);

  useEffect(() => {
    if (!canvas) return;
    if (canvasData && isInitialLoad) {
      setIsInitialLoad(false);
      updateJSON();
      onFirstLoad();
    }
  }, [canvas, canvasData]);

  useEffect(() => {
    let fabricCanvas = new fabric.Canvas(id, {
      preserveObjectStacking: true,
    });
    // fabricCanvas.backgroundColor = "red";
    fabric.Object.prototype.toObject = (function (toObject) {
      return function (propertiesToInclude) {
        propertiesToInclude = (propertiesToInclude || []).concat([
          "absolutePositioned",
          "id",
          "customIcon",
        ]);
        return toObject.apply(this, [propertiesToInclude]);
      };
    })(fabric.Object.prototype.toObject);
    setCanvas(fabricCanvas);
  }, [id]);

  const onObjectMoving = (options) => {
    const obj = options.target;
    if (obj.id == "image" && obj.clipPath) {
      obj.setCoords();
      if (obj.lockMovementY) {
        //for right side
        if (
          obj.getBoundingRect().left + obj.getBoundingRect().width <
          obj.clipPath.getBoundingRect().left +
            obj.clipPath.getBoundingRect().width
        ) {
          obj.left =
            obj.clipPath.getBoundingRect().left +
            obj.clipPath.getBoundingRect().width -
            obj.getBoundingRect().width;
        }
        // for left side
        if (obj.getBoundingRect().left > obj.clipPath.getBoundingRect().left) {
          obj.left = obj.clipPath.getBoundingRect().left;
        }
      }
      if (obj.lockMovementX) {
        //for top side
        if (obj.getBoundingRect().top > obj.clipPath.getBoundingRect().top) {
          obj.top = obj.clipPath.getBoundingRect().top;
        }
        //for bottom side
        if (
          obj.getBoundingRect().top + obj.getBoundingRect().height <
          obj.clipPath.getBoundingRect().top +
            obj.clipPath.getBoundingRect().height
        ) {
          obj.top =
            obj.clipPath.getBoundingRect().top +
            obj.clipPath.getBoundingRect().height -
            obj.getBoundingRect().height;
        }
      }
      canvas.renderAll();
      setCanvas(canvas);
    }
  };

  const onFirstLoad = async () => {
    const fabricCanvas = new fabric.Canvas("hiddenCanvas", {
      preserveObjectStacking: true,
    });
    fabric.Object.prototype.toObject = (function (toObject) {
      return function (propertiesToInclude) {
        propertiesToInclude = (propertiesToInclude || []).concat([
          "absolutePositioned",
          "id",
          "customIcon",
        ]);
        return toObject.apply(this, [propertiesToInclude]);
      };
    })(fabric.Object.prototype.toObject);
    for (const i in canvasData) {
      const canvasJSON = canvasData[i];
      fabricCanvas.loadFromJSON(canvasJSON.canvasData, function () {
        // making sure to render canvas at the end
        fabricCanvas.renderAll();
        const imageUrl = fabricCanvas.toDataURL({
          format: "svg",
          width: width,
          height: height,
        });
        // console.log('width height', width, height)
        canvasTemplateJSON[i] = {
          image: imageUrl,
          width: width,
          height: height,
        };
        canvasTemplateImage[i] = imageUrl;
        dispatch({
          type: SET_CANVAS_JSON_IMAGE,
          value: canvasTemplateImage,
        });
        dispatch({
          type: SET_CANVAS_JSON,
          value: canvasTemplateJSON,
        });
      });
    }
  };

  const loadFromJSON = (json) => {
    if (!json || Object.keys(json).length === 0) return;
    // console.log("loadFromJSON", json);
    let clipPath = null;
    let img = null;
    canvas.loadFromJSON(
      json,
      canvas.renderAll.bind(canvas),
      function (o, object) {
        if (!object) return;
        // console.log("inside function", object)
        if (object.type == "rect") {
          clipPath = object;
        }
        if (object.type == "image") {
          img = object;
          if (clipPath) {
            let scaleX = clipPath.getScaledWidth() / img.width;
            let scaleY = clipPath.getScaledHeight() / img.height;
            let lockMovementX = false;
            let lockMovementY = false;
            if (scaleX == scaleY) {
              lockMovementX = true;
              lockMovementY = true;
            }
            if (scaleX > scaleY) {
              lockMovementX = true;
            }
            if (scaleX < scaleY) {
              lockMovementY = true;
            }
            img.set({
              id: "image",
              scaleX: scaleX > scaleY ? scaleX : scaleY,
              scaleY: scaleX > scaleY ? scaleX : scaleY,
              lockMovementX: lockMovementX,
              lockMovementY: lockMovementY,
              lockRotation: true,
              hasControls: false,
              hasRotatingPoint: false,
            });
            img.hasBorders = true;
            if (scaleX < scaleY) {
              img.centerH().setCoords();
            } else {
              img.centerV().setCoords();
            }
            // console.log(img, "img");
            canvas.renderAll();
            setCanvas(canvas);
          }
        }
      }
    );
    canvas.renderAll();
    setCanvas(canvas);
    dispatch({
      type: SET_CANVAS_LOADING,
      value: false,
    });
  };

  const onUpdateCanvasImage = (index) => {
    // console.log("onUpdateCanvasImage", index);
    canvasTemplateImage[index] = canvas.toDataURL();
    dispatch({
      type: SET_CANVAS_JSON_IMAGE,
      value: canvasTemplateImage,
    });
  };

  const onUpdateCanvasData = (index) => {
    canvasData[index].canvasData = canvas.toJSON();
    setCanvasData(canvasData);
    return canvasData;
  };

  const updateJSON = () => {
    if (previousSlide !== currentSlide) {
      onUpdateCanvasImage(previousSlide);
      onUpdateCanvasData(previousSlide);
      setPreviousSlide(currentSlide);
      // dispatch({
      //   type: SET_CANVAS_CURRENT_INDEX,
      //   value: currentSlide,
      // });
    }
    const canvasJSON = canvasData[currentSlide];
    if (!canvasJSON) return;
    // console.log("before canvasJSON", canvasJSON);
    try {
      const availableFonts = [];
      canvasJSON.canvasData.objects.forEach((obj, index) => {
        // console.log("canvasData.objects",obj);
        obj.lockScalingX = true;
        obj.lockScalingY = true;
        obj.lockMovementX = true;
        obj.lockMovementY = true;
        obj.lockRotation = false;
        obj.hasControls = false;
        obj.hasRotatingPoint = false;
        obj.hasBorder = true;
        obj.index = index;
        if (obj.type === "textbox") {
          obj.backgroundColor = "#F8D6E6";
          obj.hoverCursor = "pointer";
          availableFonts.push(...obj.availableFonts);
        }
        if (obj.type === "image") {
          obj.defaultImage = obj.src;
          // obj.src = "/images/product_image_1.jpg";
        }
      });
      if (availableFonts.length > 0) {
        const WebFont = require("webfontloader");
        WebFont.load({
          google: {
            families: availableFonts,
          },
        });
      }
      setTimeout(() => {
        loadFromJSON(canvasJSON.canvasData || {});
      }, 200);
    } catch (e) {
      console.log("Error while mapping", e);
    } finally {
      setShowLoader(false);
    }
  };

  const onUpdateCanvas = () => {
    if (!canvas && !canvas.getActiveObject()) return;
    const activeObject = canvas.getActiveObject();
    // console.log("ActiveObject", activeObject);
    // console.log("onUpdateCanvas currentSlide", currentSlide)
    // onUpdateCanvasImage(currentSlide);
    onActiveCanvasUpdate({
      type: activeObject.type,
      fontSize: activeObject.fontSize,
      fontFamily: activeObject.fontFamily,
      fill: activeObject.fill,
      vAlign: activeObject.vAlign,
      textAlign: activeObject.textAlign,
      availableColours: activeObject.availableColours,
      availableFontSizes: activeObject.availableFontSizes,
      availableFonts: activeObject.availableFonts,
      availableHorizontalAlignments: activeObject.availableHorizontalAlignments,
      availableVerticalAlignments: activeObject.availableVerticalAlignments,
      appliedImageFilters: activeObject?.appliedImageFilters || [],
    });
  };

  const removeCurrentObject = () => {
    const obj = canvas.getActiveObject();
    canvas.remove(obj);
    canvas.renderAll();
  };

  const setFontSize = (value) => {
    canvas.getActiveObject().set("fontSize", value);
    canvas.renderAll();
  };

  useImperativeHandle(ref, () => ({
    getCanvas() {
      return canvas;
    },
    getCanvasActiveObject() {
      return canvas ? canvas.getActiveObject() : null;
    },
    getCanvasData() {
      return onUpdateCanvasData(currentSlide);
    },
    updateClipPathImage(value) {
      canvas.getActiveObject().setClipPathImage(value);
      canvas.renderAll();
      setCanvas(canvas);
    },
    setTextBoxFontSize(value) {
      canvas.getActiveObject().set("fontSize", value);
      canvas.renderAll();
      onUpdateCanvas();
      setCanvas(canvas);
    },
    async setTextFontFamily(value) {
      canvas.getActiveObject().set("fontFamily", value);
      canvas.renderAll();
      onUpdateCanvas();
      setCanvas(canvas);
    },
    setTextAlignment(value) {
      canvas.getActiveObject().set("textAlign", value);
      canvas.renderAll();
      onUpdateCanvas();
      setCanvas(canvas);
    },
    setVerticalTextAlignment(value) {
      canvas.getActiveObject().set("vAlign", value);
      canvas.renderAll();
      setFontSize(Number(canvas.getActiveObject().fontSize) + 1);
      setFontSize(Number(canvas.getActiveObject().fontSize) - 1);
      onUpdateCanvas();
      setCanvas(canvas);
    },
    setTextColor(value) {
      canvas.getActiveObject().set("fill", value);
      canvas.renderAll();
      onUpdateCanvas();
      setCanvas(canvas);
    },
    rotateImage(value) {
      const currentAngle = canvas.getActiveObject().angle;
      canvas.getActiveObject().rotate(currentAngle + value);
      canvas.renderAll();
    },
    applyImageFilter(value) {
      const index = Number(value);
      if (!canvas.getActiveObject().appliedImageFilters) {
        canvas.getActiveObject().appliedImageFilters = [];
      }
      // console.log(canvas.getActiveObject().appliedImageFilters);
      if (canvas.getActiveObject().appliedImageFilters.includes(index)) {
        const cIndex = canvas
          .getActiveObject()
          .appliedImageFilters.indexOf(index);
        canvas.getActiveObject().appliedImageFilters.splice(cIndex, 1);
        canvas.getActiveObject().filters.splice(index);
        canvas.getActiveObject().applyFilters();
        canvas.renderAll();
        onUpdateCanvas();
        return;
      }
      // console.log("inside push");
      canvas.getActiveObject().appliedImageFilters.push(index);
      canvas.getActiveObject().filters[index] = imageFilters[index];
      canvas.getActiveObject().applyFilters();
      canvas.renderAll();
      onUpdateCanvas();
    },
    setComponentImage(value) {
      // removeActiveObject();
      let clipPath = canvas.getActiveObject();
      if (clipPath.clipPath) {
        removeCurrentObject();
        canvas.setActiveObject(clipPath.clipPath);
        clipPath = canvas.getActiveObject();
      }
      // console.log("clipPath", clipPath);
      clipPath.absolutePositioned = true;
      fabric.util.loadImage(
        value,
        function (imgObject) {
          var img = new fabric.Image(imgObject);
          let scaleX = clipPath.getScaledWidth() / img.width;
          let scaleY = clipPath.getScaledHeight() / img.height;
          let lockMovementX = false;
          let lockMovementY = false;
          if (scaleX == scaleY) {
            lockMovementX = true;
            lockMovementY = true;
          }
          if (scaleX > scaleY) {
            lockMovementX = true;
          }
          if (scaleX < scaleY) {
            lockMovementY = true;
          }
          img.set({
            id: "image",
            clipPath: clipPath,
            left: clipPath.getBoundingRect().left,
            top: clipPath.getBoundingRect().top,
            scaleX: scaleX > scaleY ? scaleX : scaleY,
            scaleY: scaleX > scaleY ? scaleX : scaleY,
            objectCaching: false,
            lockMovementX: lockMovementX,
            lockMovementY: lockMovementY,
            lockRotation: true,
            hasControls: false,
            hasRotatingPoint: false,
          });
          img.hasBorders = true;
          canvas.add(img); // Add the picture to the canvas
          if (scaleX < scaleY) {
            img.centerH().setCoords();
          } else {
            img.centerV().setCoords();
          }
          canvas.renderAll.bind(canvas);
          canvas.setActiveObject(img);
          setCanvas(canvas);
        },
        null,
        { crossOrigin: "Anonymous" }
      );
    },
  }));

  return (
    <>
      {showLoader && <Loader />}
      <canvas
        width="5"
        height="5"
        id="hiddenCanvas"
        style={{ display: "none" }}
      />
      <canvas
        id={id}
        width={width}
        height={height}
        style={{ border: "2px dashed #8b2458" }}
      ></canvas>
    </>
  );
});
