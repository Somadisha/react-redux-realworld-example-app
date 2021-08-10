import "./App.css";
import React, { useState, useRef, useEffect } from "react";
import {
    Stage,
    Layer,
    Circle,
    Text,
    Rect,
    Transformer,
    Line,
    Label,
    Tag,
} from "react-konva";
import { v4 as uuid } from "uuid";
import { Html } from "react-konva-utils";
const Rectangle = ({
    shapeProps,
    isSelected,
    onSelect,
    onMove,
    onChange,
    useTool,
    stage,
}) => {
    const shapeRef = React.useRef();
    const trRef = React.useRef();

    React.useEffect(() => {
        if (isSelected) {
            // we need to attach transformer manually
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);

    function rotatePoint(pt, a, l) {
        var angle = a * (Math.PI / 180); // Convert to radians

        var rotatedX = pt.x + Math.cos(angle) * l;

        var rotatedY = pt.y + Math.sin(angle) * l;

        return { x: rotatedX, y: rotatedY };
    }

    return (
        <React.Fragment>
            <Rect
                onDblClick={onSelect}
                onDblTap={onSelect}
                ref={shapeRef}
                {...shapeProps}
                draggable={!useTool && isSelected}
                // onDragStart={onMove}
                // onTouchStart={onMove}
                // onDragMove={console.log(shapeProps.x, shapeProps.y)}
                onDragEnd={(e) => {
                    const gridWidth = window.innerWidth / (5 * parseInt(stage));
                    const gridHeight =
                        window.innerHeight / (10 * parseInt(stage));
                    const rectWidth = shapeProps.width;
                    const rectHeight = shapeProps.height;
                    const rectRotation = shapeProps.rotation;

                    let newX = e.target.x();
                    let pos1 = { x: e.target.x(), y: e.target.y() };
                    let pos2 = rotatePoint(
                        { x: pos1.x, y: pos1.y },
                        rectRotation,
                        rectWidth
                    );
                    let pos4 = rotatePoint(
                        { x: pos1.x, y: pos1.y },
                        rectRotation + 90,
                        rectHeight
                    );
                    let pos3 = rotatePoint(
                        { x: pos4.x, y: pos4.y },
                        rectRotation,
                        rectWidth
                    );

                    if (rectRotation >= 0 && rectRotation < 90) {
                        let newX1 = Math.floor(pos4.x / gridWidth) * gridWidth;
                        let newX2 = Math.ceil(pos2.x / gridWidth) * gridWidth;
                        if (
                            pos4.x - newX1 <= newX2 - pos2.x &&
                            pos4.x - newX1 <= 10
                        ) {
                            newX = newX - (pos4.x - newX1);
                        } else if (newX2 - pos2.x <= 10) {
                            newX = newX + (newX2 - pos2.x);
                        }
                    } else if (rectRotation >= 90 && rectRotation < 180) {
                        let newX1 = Math.floor(pos3.x / gridWidth) * gridWidth;
                        let newX2 = Math.ceil(pos1.x / gridWidth) * gridWidth;
                        if (
                            pos3.x - newX1 <= newX2 - pos1.x &&
                            pos3.x - newX1 <= 10
                        ) {
                            newX = newX - (pos3.x - newX1);
                        } else if (newX2 - pos1.x <= 10) {
                            newX = newX + (newX2 - pos1.x);
                        }
                    } else if (rectRotation >= -180 && rectRotation < -90) {
                        let newX1 = Math.floor(pos2.x / gridWidth) * gridWidth;
                        let newX2 = Math.ceil(pos4.x / gridWidth) * gridWidth;
                        if (
                            pos2.x - newX1 <= newX2 - pos4.x &&
                            pos2.x - newX1 <= 10
                        ) {
                            newX = newX - (pos2.x - newX1);
                        } else if (newX2 - pos4.x <= 10) {
                            newX = newX + (newX2 - pos4.x);
                        }
                    } else if (rectRotation >= -90 && rectRotation < 0) {
                        let newX1 = Math.floor(pos1.x / gridWidth) * gridWidth;
                        let newX2 = Math.ceil(pos3.x / gridWidth) * gridWidth;
                        if (
                            pos1.x - newX1 <= newX2 - pos3.x &&
                            pos1.x - newX1 <= 10
                        ) {
                            newX = newX - (pos1.x - newX1);
                        } else if (newX2 - pos3.x <= 10) {
                            newX = newX + (newX2 - pos3.x);
                        }
                    }

                    let newY = e.target.y();
                    if (rectRotation >= 0 && rectRotation < 90) {
                        let newY1 =
                            Math.floor(pos1.y / gridHeight) * gridHeight;
                        let newY2 = Math.ceil(pos3.y / gridHeight) * gridHeight;

                        if (
                            pos1.y - newY1 <= newY2 - pos3.y &&
                            pos1.y - newY1 <= 10
                        ) {
                            newY = newY - (pos1.y - newY1);
                        } else if (newY2 - pos3.y <= 10) {
                            newY = newY + (newY2 - pos3.y);
                        }
                    } else if (rectRotation >= 90 && rectRotation < 180) {
                        let newY1 =
                            Math.floor(pos4.y / gridHeight) * gridHeight;
                        let newY2 = Math.ceil(pos2.y / gridHeight) * gridHeight;
                        if (
                            pos4.y - newY1 <= newY2 - pos2.y &&
                            pos4.y - newY1 <= 10
                        ) {
                            newY = newY - (pos4.y - newY1);
                        } else if (newY2 - pos2.y <= 10) {
                            newY = newY + (newY2 - pos2.y);
                        }
                    } else if (rectRotation >= -180 && rectRotation < -90) {
                        let newY1 =
                            Math.floor(pos3.y / gridHeight) * gridHeight;
                        let newY2 = Math.ceil(pos1.y / gridHeight) * gridHeight;
                        if (
                            pos3.y - newY1 <= newY2 - pos1.y &&
                            pos3.y - newY1 <= 10
                        ) {
                            newY = newY - (pos3.y - newY1);
                        } else if (newY2 - pos1.y <= 10) {
                            newY = newY + (newY2 - pos1.y);
                        }
                    } else if (rectRotation >= -90 && rectRotation < 0) {
                        let newY1 =
                            Math.floor(pos2.y / gridHeight) * gridHeight;
                        let newY2 = Math.ceil(pos4.y / gridHeight) * gridHeight;
                        if (
                            pos2.y - newY1 <= newY2 - pos4.y &&
                            pos2.y - newY1 <= 10
                        ) {
                            newY = newY - (pos2.y - newY1);
                        } else if (newY2 - pos4.y <= 10) {
                            newY = newY + (newY2 - pos4.y);
                        }
                    }

                    onChange({
                        ...shapeProps,
                        x: newX,
                        y: newY,
                    });
                }}
                onTransformEnd={(e) => {
                    console.log(stage.scale);
                    const node = shapeRef.current;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();
                    // we will reset it back
                    node.scaleX(1);
                    node.scaleY(1);
                    const gridWidth = window.innerWidth / (5 * parseInt(stage));
                    const gridHeight =
                        window.innerHeight / (10 * parseInt(stage));
                    const rectWidth = node.width() * scaleX;
                    const rectHeight = node.height() * scaleY;
                    const rectRotation = node.rotation();

                    let newX = e.target.x();
                    let pos1 = { x: e.target.x(), y: e.target.y() };
                    let pos2 = rotatePoint(
                        { x: pos1.x, y: pos1.y },
                        node.rotation(),
                        rectWidth
                    );
                    let pos4 = rotatePoint(
                        { x: pos1.x, y: pos1.y },
                        node.rotation() + 90,
                        rectHeight
                    );
                    let pos3 = rotatePoint(
                        { x: pos4.x, y: pos4.y },
                        node.rotation(),
                        rectWidth
                    );

                    if (rectRotation >= 0 && rectRotation < 90) {
                        let newX1 = Math.floor(pos4.x / gridWidth) * gridWidth;
                        let newX2 = Math.ceil(pos2.x / gridWidth) * gridWidth;
                        if (
                            pos4.x - newX1 <= newX2 - pos2.x &&
                            pos4.x - newX1 <= 10
                        ) {
                            newX = newX - (pos4.x - newX1);
                        } else if (newX2 - pos2.x <= 10) {
                            newX = newX + (newX2 - pos2.x);
                        }
                    } else if (rectRotation >= 90 && rectRotation < 180) {
                        let newX1 = Math.floor(pos3.x / gridWidth) * gridWidth;
                        let newX2 = Math.ceil(pos1.x / gridWidth) * gridWidth;
                        if (
                            pos3.x - newX1 <= newX2 - pos1.x &&
                            pos3.x - newX1 <= 10
                        ) {
                            newX = newX - (pos3.x - newX1);
                        } else if (newX2 - pos1.x <= 10) {
                            newX = newX + (newX2 - pos1.x);
                        }
                    } else if (rectRotation >= -180 && rectRotation < -90) {
                        let newX1 = Math.floor(pos2.x / gridWidth) * gridWidth;
                        let newX2 = Math.ceil(pos4.x / gridWidth) * gridWidth;
                        if (
                            pos2.x - newX1 <= newX2 - pos4.x &&
                            pos2.x - newX1 <= 10
                        ) {
                            newX = newX - (pos2.x - newX1);
                        } else if (newX2 - pos4.x <= 10) {
                            newX = newX + (newX2 - pos4.x);
                        }
                    } else if (rectRotation >= -90 && rectRotation < 0) {
                        let newX1 = Math.floor(pos1.x / gridWidth) * gridWidth;
                        let newX2 = Math.ceil(pos3.x / gridWidth) * gridWidth;
                        if (
                            pos1.x - newX1 <= newX2 - pos3.x &&
                            pos1.x - newX1 <= 10
                        ) {
                            newX = newX - (pos1.x - newX1);
                        } else if (newX2 - pos3.x <= 10) {
                            newX = newX + (newX2 - pos3.x);
                        }
                    }

                    let newY = e.target.y();
                    if (rectRotation >= 0 && rectRotation < 90) {
                        let newY1 =
                            Math.floor(pos1.y / gridHeight) * gridHeight;
                        let newY2 = Math.ceil(pos3.y / gridHeight) * gridHeight;

                        if (
                            pos1.y - newY1 <= newY2 - pos3.y &&
                            pos1.y - newY1 <= 10
                        ) {
                            newY = newY - (pos1.y - newY1);
                        } else if (newY2 - pos3.y <= 10) {
                            newY = newY + (newY2 - pos3.y);
                        }
                    } else if (rectRotation >= 90 && rectRotation < 180) {
                        let newY1 =
                            Math.floor(pos4.y / gridHeight) * gridHeight;
                        let newY2 = Math.ceil(pos2.y / gridHeight) * gridHeight;
                        if (
                            pos4.y - newY1 <= newY2 - pos2.y &&
                            pos4.y - newY1 <= 10
                        ) {
                            newY = newY - (pos4.y - newY1);
                        } else if (newY2 - pos2.y <= 10) {
                            newY = newY + (newY2 - pos2.y);
                        }
                    } else if (rectRotation >= -180 && rectRotation < -90) {
                        let newY1 =
                            Math.floor(pos3.y / gridHeight) * gridHeight;
                        let newY2 = Math.ceil(pos1.y / gridHeight) * gridHeight;
                        if (
                            pos3.y - newY1 <= newY2 - pos1.y &&
                            pos3.y - newY1 <= 10
                        ) {
                            newY = newY - (pos3.y - newY1);
                        } else if (newY2 - pos1.y <= 10) {
                            newY = newY + (newY2 - pos1.y);
                        }
                    } else if (rectRotation >= -90 && rectRotation < 0) {
                        let newY1 =
                            Math.floor(pos2.y / gridHeight) * gridHeight;
                        let newY2 = Math.ceil(pos4.y / gridHeight) * gridHeight;
                        if (
                            pos2.y - newY1 <= newY2 - pos4.y &&
                            pos2.y - newY1 <= 10
                        ) {
                            newY = newY - (pos2.y - newY1);
                        } else if (newY2 - pos4.y <= 10) {
                            newY = newY + (newY2 - pos4.y);
                        }
                    }

                    // transformer is changing scale of the node
                    // and NOT its width or height
                    // but in the store we have only width and height
                    // to match the data better we will reset scale on transform end

                    onChange({
                        ...shapeProps,
                        x: newX,
                        y: newY,

                        // set minimal value
                        width: node.width() * scaleX,
                        height: node.height() * scaleY,
                        rotation: node.rotation(),
                    });
                }}
            />
            {isSelected && (
                <Transformer
                    ref={trRef}
                    boundBoxFunc={(oldBox, newBox) => {
                        // limit resize
                        if (newBox.width < 5 || newBox.height < 5) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                />
            )}
        </React.Fragment>
    );
};

const Circles = ({
    shapeProps,
    isSelected,
    onSelect,
    onMove,
    onChange,
    useTool,
    stage,
}) => {
    const shapeRef = React.useRef();
    const trRef = React.useRef();

    React.useEffect(() => {
        if (isSelected) {
            // we need to attach transformer manually
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);

    return (
        <React.Fragment>
            <Circle
                onDblClick={onSelect}
                onDblTap={onSelect}
                ref={shapeRef}
                {...shapeProps}
                draggable={!useTool && isSelected}
                // onDragStart={onMove}
                // onTouchStart={onMove}
                onDragEnd={(e) => {
                    const gridWidth = window.innerWidth / (5 * parseInt(stage));
                    const gridHeight =
                        window.innerHeight / (10 * parseInt(stage));
                    const circRadius = shapeProps.radius;
                    let newX = e.target.x();
                    let newX1 =
                        Math.floor((newX - circRadius) / gridWidth) * gridWidth;
                    let newX2 =
                        Math.ceil((newX + circRadius) / gridWidth) * gridWidth;
                    // console.log(newX1, newX, newX2)
                    // console.log(newX-newX1+circRadius, newX, newX2-newX-circRadius)
                    if (
                        newX - newX1 - circRadius <=
                        newX2 - newX - circRadius &&
                        newX - newX1 - circRadius <= 10
                    ) {
                        newX = newX1 + circRadius;
                    } else if (newX2 - newX - circRadius <= 10) {
                        newX = newX2 - circRadius;
                    }
                    let newY = e.target.y();
                    let newY1 =
                        Math.floor((newY - circRadius) / gridHeight) *
                        gridHeight;
                    let newY2 =
                        Math.ceil((newY + circRadius) / gridHeight) *
                        gridHeight;
                    // console.log(newY1, newY, newY2)
                    // console.log(newY-newY1+circRadius, newY, newY2-newY-circRadius)
                    if (
                        newY - newY1 - circRadius <=
                        newY2 - newY - circRadius &&
                        newY - newY1 - circRadius <= 10
                    ) {
                        newY = newY1 + circRadius;
                    } else if (newY2 - newY - circRadius <= 10) {
                        newY = newY2 - circRadius;
                    }
                    onChange({
                        ...shapeProps,
                        x: newX,
                        y: newY,
                    });
                }}
                onTransformEnd={(e) => {
                    // transformer is changing scale of the node
                    // and NOT its width or height
                    // but in the store we have only width and height
                    // to match the data better we will reset scale on transform end
                    const node = shapeRef.current;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    // we will reset it back
                    node.scaleX(1);
                    node.scaleY(1);

                    const gridWidth = window.innerWidth / (5 * parseInt(stage));
                    const gridHeight =
                        window.innerHeight / (10 * parseInt(stage));
                    const circRadius = Math.max(
                        node.radius() * scaleX,
                        node.radius() * scaleY
                    );
                    let newX = e.target.x();
                    let newX1 =
                        Math.floor((newX - circRadius) / gridWidth) * gridWidth;
                    let newX2 =
                        Math.ceil((newX + circRadius) / gridWidth) * gridWidth;

                    // console.log(newX1, newX, newX2)
                    // console.log(newX-newX1+circRadius, newX, newX2-newX-circRadius)
                    if (
                        newX - newX1 - circRadius <=
                        newX2 - newX - circRadius &&
                        newX - newX1 - circRadius <= 10
                    ) {
                        newX = newX1 + circRadius;
                    } else if (newX2 - newX - circRadius <= 10) {
                        newX = newX2 - circRadius;
                    }
                    let newY = e.target.y();
                    let newY1 =
                        Math.floor((newY - circRadius) / gridHeight) *
                        gridHeight;
                    let newY2 =
                        Math.ceil((newY + circRadius) / gridHeight) *
                        gridHeight;
                    // console.log(newY1, newY, newY2)
                    // console.log(newY-newY1+circRadius, newY, newY2-newY-circRadius)
                    if (
                        newY - newY1 - circRadius <=
                        newY2 - newY - circRadius &&
                        newY - newY1 - circRadius <= 10
                    ) {
                        newY = newY1 + circRadius;
                    } else if (newY2 - newY - circRadius <= 10) {
                        newY = newY2 - circRadius;
                    }

                    onChange({
                        ...shapeProps,
                        x: newX,
                        y: newY,
                        // set minimal value
                        radius: circRadius,
                        rotation: node.rotation(),
                    });
                }}
            />
            {isSelected && (
                <Transformer
                    ref={trRef}
                    rotateEnabled={false}
                    boundBoxFunc={(oldBox, newBox) => {
                        // limit resize
                        if (newBox.radius < 5) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                />
            )}
        </React.Fragment>
    );
};

const Texts = ({
    shapeProps,
    isSelected,
    onSelect,
    onMove,
    onChange,
    useTool,
    stage,
}) => {
    const shapeRef = React.useRef();
    const trRef = React.useRef();

    React.useEffect(() => {
        if (isSelected) {
            // we need to attach transformer manually
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);

    function rotatePoint(pt, a, l) {
        var angle = a * (Math.PI / 180); // Convert to radians

        var rotatedX = pt.x + Math.cos(angle) * l;

        var rotatedY = pt.y + Math.sin(angle) * l;

        return { x: rotatedX, y: rotatedY };
    }

    return (
        <React.Fragment>
            <Text
                onDblClick={onSelect}
                onDblTap={onSelect}
                ref={shapeRef}
                {...shapeProps}
                draggable={!useTool && isSelected}
                // onDragStart={onMove}
                // onTouchStart={onMove}
                onDragEnd={(e) => {
                    const gridWidth = window.innerWidth / (5 * parseInt(stage));
                    const gridHeight =
                        window.innerHeight / (10 * parseInt(stage));
                    const rectWidth = shapeProps.width;
                    const rectHeight = shapeProps.height;

                    const rectRotation = shapeProps.rotation;

                    let newX = e.target.x();
                    let pos1 = { x: e.target.x(), y: e.target.y() };
                    let pos2 = rotatePoint(
                        { x: pos1.x, y: pos1.y },
                        rectRotation,
                        rectWidth
                    );
                    let pos4 = rotatePoint(
                        { x: pos1.x, y: pos1.y },
                        rectRotation + 90,
                        rectHeight
                    );
                    let pos3 = rotatePoint(
                        { x: pos4.x, y: pos4.y },
                        rectRotation,
                        rectWidth
                    );

                    if (rectRotation >= 0 && rectRotation < 90) {
                        let newX1 = Math.floor(pos4.x / gridWidth) * gridWidth;
                        let newX2 = Math.ceil(pos2.x / gridWidth) * gridWidth;
                        if (
                            pos4.x - newX1 <= newX2 - pos2.x &&
                            pos4.x - newX1 <= 10
                        ) {
                            newX = newX - (pos4.x - newX1);
                        } else if (newX2 - pos2.x <= 10) {
                            newX = newX + (newX2 - pos2.x);
                        }
                    } else if (rectRotation >= 90 && rectRotation < 180) {
                        let newX1 = Math.floor(pos3.x / gridWidth) * gridWidth;
                        let newX2 = Math.ceil(pos1.x / gridWidth) * gridWidth;
                        if (
                            pos3.x - newX1 <= newX2 - pos1.x &&
                            pos3.x - newX1 <= 10
                        ) {
                            newX = newX - (pos3.x - newX1);
                        } else if (newX2 - pos1.x <= 10) {
                            newX = newX + (newX2 - pos1.x);
                        }
                    } else if (rectRotation >= -180 && rectRotation < -90) {
                        let newX1 = Math.floor(pos2.x / gridWidth) * gridWidth;
                        let newX2 = Math.ceil(pos4.x / gridWidth) * gridWidth;
                        if (
                            pos2.x - newX1 <= newX2 - pos4.x &&
                            pos2.x - newX1 <= 10
                        ) {
                            newX = newX - (pos2.x - newX1);
                        } else if (newX2 - pos4.x <= 10) {
                            newX = newX + (newX2 - pos4.x);
                        }
                    } else if (rectRotation >= -90 && rectRotation < 0) {
                        let newX1 = Math.floor(pos1.x / gridWidth) * gridWidth;
                        let newX2 = Math.ceil(pos3.x / gridWidth) * gridWidth;
                        if (
                            pos1.x - newX1 <= newX2 - pos3.x &&
                            pos1.x - newX1 <= 10
                        ) {
                            newX = newX - (pos1.x - newX1);
                        } else if (newX2 - pos3.x <= 10) {
                            newX = newX + (newX2 - pos3.x);
                        }
                    }

                    let newY = e.target.y();
                    if (rectRotation >= 0 && rectRotation < 90) {
                        let newY1 =
                            Math.floor(pos1.y / gridHeight) * gridHeight;
                        let newY2 = Math.ceil(pos3.y / gridHeight) * gridHeight;

                        if (
                            pos1.y - newY1 <= newY2 - pos3.y &&
                            pos1.y - newY1 <= 10
                        ) {
                            newY = newY - (pos1.y - newY1);
                        } else if (newY2 - pos3.y <= 10) {
                            newY = newY + (newY2 - pos3.y);
                        }
                    } else if (rectRotation >= 90 && rectRotation < 180) {
                        let newY1 =
                            Math.floor(pos4.y / gridHeight) * gridHeight;
                        let newY2 = Math.ceil(pos2.y / gridHeight) * gridHeight;
                        if (
                            pos4.y - newY1 <= newY2 - pos2.y &&
                            pos4.y - newY1 <= 10
                        ) {
                            newY = newY - (pos4.y - newY1);
                        } else if (newY2 - pos2.y <= 10) {
                            newY = newY + (newY2 - pos2.y);
                        }
                    } else if (rectRotation >= -180 && rectRotation < -90) {
                        let newY1 =
                            Math.floor(pos3.y / gridHeight) * gridHeight;
                        let newY2 = Math.ceil(pos1.y / gridHeight) * gridHeight;
                        if (
                            pos3.y - newY1 <= newY2 - pos1.y &&
                            pos3.y - newY1 <= 10
                        ) {
                            newY = newY - (pos3.y - newY1);
                        } else if (newY2 - pos1.y <= 10) {
                            newY = newY + (newY2 - pos1.y);
                        }
                    } else if (rectRotation >= -90 && rectRotation < 0) {
                        let newY1 =
                            Math.floor(pos2.y / gridHeight) * gridHeight;
                        let newY2 = Math.ceil(pos4.y / gridHeight) * gridHeight;
                        if (
                            pos2.y - newY1 <= newY2 - pos4.y &&
                            pos2.y - newY1 <= 10
                        ) {
                            newY = newY - (pos2.y - newY1);
                        } else if (newY2 - pos4.y <= 10) {
                            newY = newY + (newY2 - pos4.y);
                        }
                    }

                    onChange({
                        ...shapeProps,
                        x: newX,
                        y: newY,
                    });
                }}
                onTransformEnd={(e) => {
                    // transformer is changing scale of the node
                    // and NOT its width or height
                    // but in the store we have only width and height
                    // to match the data better we will reset scale on transform end
                    const node = shapeRef.current;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    // we will reset it back
                    node.scaleX(1);
                    node.scaleY(1);
                    const gridWidth = window.innerWidth / (5 * parseInt(stage));
                    const gridHeight =
                        window.innerHeight / (10 * parseInt(stage));
                    const rectWidth = node.width() * scaleX;
                    const rectHeight = node.height() * scaleY;

                    const rectRotation = node.rotation();

                    let newX = e.target.x();
                    let pos1 = { x: e.target.x(), y: e.target.y() };
                    let pos2 = rotatePoint(
                        { x: pos1.x, y: pos1.y },
                        node.rotation(),
                        rectWidth
                    );
                    let pos4 = rotatePoint(
                        { x: pos1.x, y: pos1.y },
                        node.rotation() + 90,
                        rectHeight
                    );
                    let pos3 = rotatePoint(
                        { x: pos4.x, y: pos4.y },
                        node.rotation(),
                        rectWidth
                    );

                    if (rectRotation >= 0 && rectRotation < 90) {
                        let newX1 = Math.floor(pos4.x / gridWidth) * gridWidth;
                        let newX2 = Math.ceil(pos2.x / gridWidth) * gridWidth;
                        if (
                            pos4.x - newX1 <= newX2 - pos2.x &&
                            pos4.x - newX1 <= 10
                        ) {
                            newX = newX - (pos4.x - newX1);
                        } else if (newX2 - pos2.x <= 10) {
                            newX = newX + (newX2 - pos2.x);
                        }
                    } else if (rectRotation >= 90 && rectRotation < 180) {
                        let newX1 = Math.floor(pos3.x / gridWidth) * gridWidth;
                        let newX2 = Math.ceil(pos1.x / gridWidth) * gridWidth;
                        if (
                            pos3.x - newX1 <= newX2 - pos1.x &&
                            pos3.x - newX1 <= 10
                        ) {
                            newX = newX - (pos3.x - newX1);
                        } else if (newX2 - pos1.x <= 10) {
                            newX = newX + (newX2 - pos1.x);
                        }
                    } else if (rectRotation >= -180 && rectRotation < -90) {
                        let newX1 = Math.floor(pos2.x / gridWidth) * gridWidth;
                        let newX2 = Math.ceil(pos4.x / gridWidth) * gridWidth;
                        if (
                            pos2.x - newX1 <= newX2 - pos4.x &&
                            pos2.x - newX1 <= 10
                        ) {
                            newX = newX - (pos2.x - newX1);
                        } else if (newX2 - pos4.x <= 10) {
                            newX = newX + (newX2 - pos4.x);
                        }
                    } else if (rectRotation >= -90 && rectRotation < 0) {
                        let newX1 = Math.floor(pos1.x / gridWidth) * gridWidth;
                        let newX2 = Math.ceil(pos3.x / gridWidth) * gridWidth;
                        if (
                            pos1.x - newX1 <= newX2 - pos3.x &&
                            pos1.x - newX1 <= 10
                        ) {
                            newX = newX - (pos1.x - newX1);
                        } else if (newX2 - pos3.x <= 10) {
                            newX = newX + (newX2 - pos3.x);
                        }
                    }

                    let newY = e.target.y();
                    if (rectRotation >= 0 && rectRotation < 90) {
                        let newY1 =
                            Math.floor(pos1.y / gridHeight) * gridHeight;
                        let newY2 = Math.ceil(pos3.y / gridHeight) * gridHeight;

                        if (
                            pos1.y - newY1 <= newY2 - pos3.y &&
                            pos1.y - newY1 <= 10
                        ) {
                            newY = newY - (pos1.y - newY1);
                        } else if (newY2 - pos3.y <= 10) {
                            newY = newY + (newY2 - pos3.y);
                        }
                    } else if (rectRotation >= 90 && rectRotation < 180) {
                        let newY1 =
                            Math.floor(pos4.y / gridHeight) * gridHeight;
                        let newY2 = Math.ceil(pos2.y / gridHeight) * gridHeight;
                        if (
                            pos4.y - newY1 <= newY2 - pos2.y &&
                            pos4.y - newY1 <= 10
                        ) {
                            newY = newY - (pos4.y - newY1);
                        } else if (newY2 - pos2.y <= 10) {
                            newY = newY + (newY2 - pos2.y);
                        }
                    } else if (rectRotation >= -180 && rectRotation < -90) {
                        let newY1 =
                            Math.floor(pos3.y / gridHeight) * gridHeight;
                        let newY2 = Math.ceil(pos1.y / gridHeight) * gridHeight;
                        if (
                            pos3.y - newY1 <= newY2 - pos1.y &&
                            pos3.y - newY1 <= 10
                        ) {
                            newY = newY - (pos3.y - newY1);
                        } else if (newY2 - pos1.y <= 10) {
                            newY = newY + (newY2 - pos1.y);
                        }
                    } else if (rectRotation >= -90 && rectRotation < 0) {
                        let newY1 =
                            Math.floor(pos2.y / gridHeight) * gridHeight;
                        let newY2 = Math.ceil(pos4.y / gridHeight) * gridHeight;
                        if (
                            pos2.y - newY1 <= newY2 - pos4.y &&
                            pos2.y - newY1 <= 10
                        ) {
                            newY = newY - (pos2.y - newY1);
                        } else if (newY2 - pos4.y <= 10) {
                            newY = newY + (newY2 - pos4.y);
                        }
                    }

                    onChange({
                        ...shapeProps,
                        x: newX,
                        y: newY,
                        // set minimal value

                        width: node.width() * scaleX,
                        height: node.height() * scaleY,
                        rotation: node.rotation(),
                    });
                }}
            />
            {isSelected && (
                <Transformer
                    ref={trRef}
                    boundBoxFunc={(oldBox, newBox) => {
                        // limit resize
                        if (newBox.width < 5 || newBox.height < 5) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                />
            )}
        </React.Fragment>
    );
};

const Lines = ({
    shapeProps,
    isSelected,
    onSelect,
    onMove,
    onChange,
    points,
    tool,
    useTool,
}) => {
    const shapeRef = React.useRef();
    const trRef = React.useRef();

    React.useEffect(() => {
        if (isSelected) {
            // we need to attach transformer manually
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);

    return (
        <React.Fragment>
            <Line
                onDblClick={onSelect}
                onDblTap={onSelect}
                ref={shapeRef}
                {...shapeProps}
                points={points}
                stroke="#df4b26"
                strokeWidth={5}
                tension={0.5}
                lineCap="round"
                draggable={!useTool && isSelected}
                globalCompositeOperation={
                    tool === "eraser" ? "destination-out" : "source-over"
                }
                // onDragStart={onMove}
                // onTouchStart={onMove}
                onDragEnd={(e) => {
                    onChange({
                        ...shapeProps,
                        x: e.target.x(),
                        y: e.target.y(),
                    });
                }}
                onTransformEnd={(e) => {
                    // transformer is changing scale of the node
                    // and NOT its width or height
                    // but in the store we have only width and height
                    // to match the data better we will reset scale on transform end
                    const node = shapeRef.current;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    // we will reset it back
                    node.scaleX(1);
                    node.scaleY(1);
                    let newPoints = [];

                    for (let i = 0; i < shapeProps.points.length; i = i + 2) {
                        newPoints = newPoints.concat([
                            shapeProps.points[i] * scaleX,
                            shapeProps.points[i + 1] * scaleY,
                        ]);
                    }
                    onChange({
                        ...shapeProps,
                        // x: node.x(),
                        // y: node.y(),
                        // set minimal value
                        points: newPoints,
                        rotation: node.rotation(),
                        // width: Math.max(5, node.width() * scaleX),
                        // height: Math.max(node.height() * scaleY),
                    });
                }}
            />
            {isSelected && (
                <Transformer
                    ref={trRef}
                    boundBoxFunc={(oldBox, newBox) => {
                        // limit resize
                        if (newBox.width < 5 || newBox.height < 5) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                />
            )}
        </React.Fragment>
    );
};

let history = [{ shapes: [], lines: [] }];
let historyStep = 0;

export default function App() {
    const [scale, setScale] = useState(1);
    const [stage, setStage] = useState({ x: 0, y: 0 });
    const [shapes, setShapes] = useState([]);
    const [selectedId, selectShape] = useState(null);
    const [textEdit, setTextEdit] = useState(false);
    const [editShape, setEditShape] = useState(null);
    const [tool, setTool] = React.useState("");
    const [lines, setLines] = React.useState([]);
    const isDrawing = React.useRef(false);
    const [useTool, setUseTool] = useState(false);
    const [handleDraw, setHandleDraw] = useState(false);

    const handleWheel = (e) => {
        e.evt.preventDefault();

        const scaleBy = 1.2;
        const stage = e.target.getStage();
        const oldScale = stage.scaleX();
        const mousePointTo = {
            x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
            y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
        };

        const newScale =
            e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
        const newX =
            (stage.getPointerPosition().x / newScale - mousePointTo.x) *
            newScale;
        const newY =
            (stage.getPointerPosition().y / newScale - mousePointTo.y) *
            newScale;
        // console.log(oldScale, newScale);
        // console.log(newX, newY)
        // console.log(e.evt.deltaY)
        if (newScale < 1 || newX >= 0 || newY >= 0) {
            setScale(1);
            setStage({ x: 0, y: 0 });
            gridLines(5, 10);
        } else {
            setScale(newScale);
            setStage({ x: newX, y: newY });
            gridLines(5 * parseInt(newScale), 10 * parseInt(newScale));
        }
    };

    const [linesA, setLinesA] = useState([]);
    const [linesB, setLinesB] = useState([]);
    const gridLines = (a, b) => {
        const gridWidth = window.innerWidth / a;
        const gridHeight = window.innerHeight / b;
        setLinesA([]);
        setLinesB([]);

        for (let i = 0; i <= window.innerHeight; i = i + gridHeight) {
            setLinesA((prevData) => [
                ...prevData,
                [0, i, window.innerWidth, i],
            ]);
        }
        for (let i = 0; i <= window.innerWidth; i = i + gridWidth) {
            setLinesB((prevData) => [
                ...prevData,
                [i, 0, i, window.innerHeight],
            ]);
        }
    };

    const handleUndo = () => {
        console.log("undo");
        if (historyStep === 0) {
            return;
        }
        historyStep -= 1;
        const previous = history[historyStep];
        setLines(previous.lines);
        setShapes(previous.shapes);
    };

    const handleRedo = () => {
        console.log("redo");
        if (historyStep === history.length - 1) {
            return;
        }
        historyStep += 1;
        const next = history[historyStep];
        setLines(next.lines);
        setShapes(next.shapes);
    };

    const handleMouseDown = (e) => {
        // console.log(e.target.getStage().getPointerPosition())
        if (useTool) {
            isDrawing.current = true;
            // const transform = e.target.getAbsoluteTransform().copy()
            // transform.invert()
            const stage = e.target.getStage();
            let pos = stage.getPointerPosition();
            // pos = transform.point(pos)
            setLines([
                ...lines,
                {
                    tool,
                    points: [pos.x, pos.y],
                    name: "line",
                    x: 0,
                    y: 0,
                    id: uuid(),
                },
            ]);
            setShapes([
                ...shapes,
                {
                    tool,
                    points: [pos.x, pos.y],
                    name: "line",
                    index: lines.length,
                    x: e.target.x(),
                    y: e.target.y(),
                    id: uuid(),
                },
            ]);

            setHandleDraw(true);
        }
        checkDeselect(e);
    };

    const handleMouseMove = (e) => {
        if (useTool) {
            if (handleDraw) {
                // no drawing - skipping
                if (!isDrawing.current) {
                    return;
                }
                const stage = e.target.getStage();
                const point = stage.getPointerPosition();
                let lastLine = lines[lines.length - 1];
                // add point
                lastLine.points = lastLine.points.concat([point.x, point.y]);

                // replace last
                lines.splice(lines.length - 1, 1, lastLine);
                setLines(lines.concat());

                // let lastLine = ''
                // for(var i=shapes.length-1; i > 0;i--){
                //   if(shapes[i].name=='line'){
                //     lastLine = shapes[shapes.length - 1];
                //   }
                // }

                // // add point
                // lastLine.points = lastLine.points.concat([point.x, point.y]);

                // // replace last
                // shapes.splice(shapes.length - 1, 1, lastLine);
                // setShapes(shapes.concat());
            }
        }
    };

    const handleMouseUp = () => {
        if (useTool) {
            isDrawing.current = false;
            setHandleDraw(false);
            history = history.slice(0, historyStep + 1);
            history = history.concat([{ shapes: shapes, lines: lines }]);
            historyStep += 1;
        }
    };

    const checkDeselect = (e) => {
        // deselect when clicked on empty area
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            selectShape(null);
        }
        setTextEdit(false);
    };

    const stageRef = useRef(null);

    const onDelete = (item) => {
        setShapes((oldData) => {
            return oldData.filter((currentData, index) => {
                return currentData.id !== item.id;
            });
        });
        setShapes((prevShape) => [...prevShape, item]);
        history = history.slice(0, historyStep + 1);
        history = history.concat([{ shapes: [...shapes, item], lines: lines }]);
        historyStep += 1;
    };

    const onEdit = (e) => {
        let pos = {};
        setEditShape((shape) => ({ ...shape, text: e.target.value }));
        setShapes(
            shapes.map((elem) => {
                if (elem.id === selectedId) {
                    pos = { ...elem, text: e.target.value };
                    return pos;
                }
                return elem;
            })
        );
        history = history.slice(0, historyStep + 1);
        history = history.concat([{ shapes: [...shapes, pos], lines: lines }]);
        historyStep += 1;
    };

    const handleSave = () => {
        const data = JSON.stringify([shapes, lines]);
        localStorage.setItem("data", data);
    };

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("data"));
        if (data) {
            setLines(data[1]);
            setShapes(data[0]);
            history = [{ shapes: data[0], lines: data[1] }];
            // historyStep += 1;
        }
        gridLines(5, 10);
    }, []);

    return (
        <>
            <Stage
                width={window.innerWidth}
                height={window.innerHeight}
                ref={stageRef}
                onTouchStart={(e) => {
                    checkDeselect(e);
                    handleMouseDown(e);
                }}
                onMouseDown={handleMouseDown}
                onTouchEnd={handleMouseUp}
                onMousemove={handleMouseMove}
                onTouchMove={handleMouseMove}
                onMouseup={handleMouseUp}
                onWheel={handleWheel}
                scaleX={scale}
                scaleY={scale}
                x={stage.x}
                y={stage.y}
            >
                <Layer>
                    {linesA.map((eachLine, i) => {
                        return (
                            <Line
                                key={i}
                                strokeWidth={1}
                                stroke={"gray"}
                                points={eachLine}
                            />
                        );
                    })}
                    {linesB.map((eachLine, i) => {
                        return (
                            <Line
                                key={i}
                                strokeWidth={1}
                                stroke={"gray"}
                                points={eachLine}
                            />
                        );
                    })}

                    {shapes.map((eachShape, i) => {
                        if (eachShape.name === "rectangle") {
                            return (
                                <Rectangle
                                    key={i}
                                    shapeProps={eachShape}
                                    isSelected={eachShape.id === selectedId}
                                    onSelect={() => {
                                        setUseTool(false);
                                        onDelete(eachShape);
                                        selectShape(eachShape.id);
                                    }}
                                    onMove={() => onDelete(eachShape)}
                                    onChange={(newAttrs) => {
                                        const rects = shapes.slice();
                                        rects[i] = newAttrs;

                                        history = history.slice(
                                            0,
                                            historyStep + 1
                                        );
                                        history = history.concat([
                                            { shapes: rects, lines: lines },
                                        ]);
                                        historyStep += 1;
                                        onDelete(eachShape);
                                        setShapes(rects);
                                    }}
                                    useTool={useTool}
                                    stage={scale}
                                />
                            );
                        } else if (eachShape.name === "circle") {
                            return (
                                <Circles
                                    key={i}
                                    shapeProps={eachShape}
                                    isSelected={eachShape.id === selectedId}
                                    onSelect={() => {
                                        setUseTool(false);
                                        onDelete(eachShape);
                                        selectShape(eachShape.id);
                                    }}
                                    onMove={() => onDelete(eachShape)}
                                    onChange={(newAttrs) => {
                                        const rects = shapes.slice();
                                        rects[i] = newAttrs;
                                        setShapes(rects);
                                        history = history.slice(
                                            0,
                                            historyStep + 1
                                        );
                                        history = history.concat([
                                            { shapes: rects, lines: lines },
                                        ]);
                                        historyStep += 1;
                                    }}
                                    useTool={useTool}
                                    stage={scale}
                                />
                            );
                        } else if (eachShape.name === "text") {
                            return (
                                <Texts
                                    key={i}
                                    shapeProps={eachShape}
                                    isSelected={eachShape.id === selectedId}
                                    onSelect={() => {
                                        setUseTool(false);
                                        onDelete(eachShape);
                                        selectShape(eachShape.id);
                                        setEditShape(eachShape);
                                        setTextEdit(!textEdit);
                                    }}
                                    onMove={() => onDelete(eachShape)}
                                    onChange={(newAttrs) => {
                                        const rects = shapes.slice();
                                        rects[i] = newAttrs;
                                        setShapes(rects);
                                        history = history.slice(
                                            0,
                                            historyStep + 1
                                        );
                                        history = history.concat([
                                            { shapes: rects, lines: lines },
                                        ]);
                                        historyStep += 1;
                                    }}
                                    useTool={useTool}
                                    stage={scale}
                                />
                            );
                        } else if (eachShape.name === "line") {
                            return (
                                <Lines
                                    key={i}
                                    points={lines[eachShape.index].points}
                                    tool={lines[eachShape.index].tool}
                                    shapeProps={lines[eachShape.index]}
                                    isSelected={
                                        lines[eachShape.index].id === selectedId
                                    }
                                    onSelect={() => {
                                        setUseTool(false);
                                        onDelete(eachShape);
                                        selectShape(lines[eachShape.index].id);
                                    }}
                                    onMove={() => onDelete(eachShape)}
                                    onChange={(newAttrs) => {
                                        const rects = lines.slice();
                                        rects[eachShape.index] = newAttrs;
                                        setLines(rects);
                                        history = history.slice(
                                            0,
                                            historyStep + 1
                                        );
                                        history = history.concat([
                                            { shapes: shapes, lines: rects },
                                        ]);
                                        historyStep += 1;
                                    }}
                                    useTool={useTool}
                                />
                            );
                        }
                        else if (eachShape.name === "button") {
                            return (
                                <Label
                                    draggable
                                    x={eachShape.x}
                                    y={eachShape.y}
                                    onClick={() => alert('clicked')}
                                >

                                    <Tag
                                        fill={'#6200ee'}

                                        fontFamily={'Calibri'}
                                        fontSize={18}
                                        padding={5}

                                        lineJoin={'round'}
                                        cornerRadius={5}
                                    />
                                    <Text
                                        height={40}
                                        width={100}
                                        align="center"
                                        verticalAlign="middle"
                                        text={"BUTTON"}
                                        fontFamily={'Calibri'}
                                        fontSize={18}
                                        padding={10}
                                        fill={'white'}
                                    />
                                </Label>
                            )
                        }
                    })}

                    <Circle
                        x={50}
                        y={70}
                        radius={25}
                        stroke="black"
                        id="circle1"
                    />
                    <Circle
                        name="draggableCircle"
                        x={50}
                        y={70}
                        radius={25}
                        stroke="black"
                        draggable={!useTool}
                        id="circle2"
                        // onClick={()=>setUseTool(false)}
                        // onTap={()=>setUseTool(false)}
                        // onDragStart={()=>setUseTool(false)}
                        onDragEnd={(e) => {
                            const gridWidth =
                                window.innerWidth / (5 * parseInt(scale));
                            const gridHeight =
                                window.innerHeight / (10 * parseInt(scale));
                            const circRadius = 25;
                            let newX = e.target.x();
                            let newX1 =
                                Math.floor((newX - circRadius) / gridWidth) *
                                gridWidth;
                            let newX2 =
                                Math.ceil((newX + circRadius) / gridWidth) *
                                gridWidth;
                            // console.log(newX1, newX, newX2)
                            // console.log(newX-newX1+circRadius, newX, newX2-newX-circRadius)
                            if (
                                newX - newX1 - circRadius <=
                                newX2 - newX - circRadius &&
                                newX - newX1 - circRadius <= 10
                            ) {
                                newX = newX1 + circRadius;
                            } else if (newX2 - newX - circRadius <= 10) {
                                newX = newX2 - circRadius;
                            }
                            let newY = e.target.y();
                            let newY1 =
                                Math.floor((newY - circRadius) / gridHeight) *
                                gridHeight;
                            let newY2 =
                                Math.ceil((newY + circRadius) / gridHeight) *
                                gridHeight;
                            // console.log(newY1, newY, newY2)
                            // console.log(newY-newY1+circRadius, newY, newY2-newY-circRadius)
                            if (
                                newY - newY1 - circRadius <=
                                newY2 - newY - circRadius &&
                                newY - newY1 - circRadius <= 10
                            ) {
                                newY = newY1 + circRadius;
                            } else if (newY2 - newY - circRadius <= 10) {
                                newY = newY2 - circRadius;
                            }
                            // push new circle to view
                            // note that we must push circle first before returning draggable circle
                            // because e.target.x returns draggable circle's positions
                            const pos = {
                                x: newX,
                                y: newY,
                                radius: 25,
                                stroke: "black",
                                id: uuid(),
                                fill: "red",
                                name: "circle",
                            };

                            setShapes((prevCircles) => [...prevCircles, pos]);

                            // return draggable circle to original position
                            // notice the dot (.) before "draggableCircle"
                            var stage = stageRef.current;
                            var draggableCircle =
                                stage.findOne(".draggableCircle");
                            draggableCircle.position({ x: 50, y: 70 });
                            history = history.slice(0, historyStep + 1);
                            history = history.concat([
                                { shapes: [...shapes, pos], lines: lines },
                            ]);
                            historyStep += 1;
                        }}
                    />

                    <Rect
                        x={25}
                        y={100}
                        width={50}
                        height={50}
                        stroke="black"
                        id="rect1"
                    />
                    <Rect
                        name="draggableRect"
                        x={25}
                        y={100}
                        width={50}
                        height={50}
                        stroke="black"
                        id="rect1"
                        draggable={!useTool}
                        // onClick={()=>setUseTool(false)}
                        // onTap={()=>setUseTool(false)}
                        // onDragStart={()=>setUseTool(false)}
                        onDragEnd={(e) => {
                            const gridWidth =
                                window.innerWidth / (5 * parseInt(scale));
                            const gridHeight =
                                window.innerHeight / (10 * parseInt(scale));
                            const rectWidth = 50;
                            const rectHeight = 50;

                            let newX = e.target.x();
                            let newX1 =
                                Math.floor(newX / gridWidth) * gridWidth;
                            let newX2 =
                                Math.ceil((newX + rectWidth) / gridWidth) *
                                gridWidth;
                            console.log(newX1, newX, newX2);
                            if (
                                newX - newX1 <= newX2 - newX - rectWidth &&
                                newX - newX1 <= 10
                            ) {
                                newX = newX1;
                            } else if (newX2 - newX - rectWidth <= 10) {
                                newX = newX2 - rectWidth;
                            }

                            let newY = e.target.y();
                            let newY1 =
                                Math.floor(newY / gridHeight) * gridHeight;
                            let newY2 =
                                Math.ceil((newY + rectHeight) / gridHeight) *
                                gridHeight;

                            console.log(newY1, newY, newY2);
                            if (
                                newY - newY1 <= newY2 - newY - rectHeight &&
                                newY - newY1 <= 10
                            ) {
                                newY = newY1;
                            } else if (newY2 - newY - rectHeight <= 10) {
                                newY = newY2 - rectHeight;
                            }

                            // push new circle to view
                            // note that we must push circle first before returning draggable circle
                            // because e.target.x returns draggable circle's positions
                            const pos = {
                                x: newX,
                                y: newY,
                                stroke: "black",
                                width: rectWidth,
                                height: rectHeight,
                                id: uuid(),
                                fill: "green",
                                name: "rectangle",
                                rotation: 0,
                            };
                            setShapes((prevRectangles) => [
                                ...prevRectangles,
                                pos,
                            ]);

                            // return draggable circle to original position
                            // notice the dot (.) before "draggableCircle"
                            var stage = stageRef.current;
                            var draggableRectangle =
                                stage.findOne(".draggableRect");
                            draggableRectangle.position({ x: 25, y: 100 });
                            history = history.slice(0, historyStep + 1);
                            history = history.concat([
                                { shapes: [...shapes, pos], lines: lines },
                            ]);
                            historyStep += 1;
                        }}
                    />
                    <Text
                        fontSize={50}
                        text="T"
                        width={40}
                        height={100}
                        x={35}
                        y={160}
                    />
                    <Text
                        name="draggableText"
                        x={35}
                        y={160}
                        text="T"
                        fontSize={50}
                        width={40}
                        height={100}
                        draggable={!useTool}
                        // onClick={()=>setUseTool(false)}
                        // onTap={()=>setUseTool(false)}
                        // onDragStart={()=>setUseTool(false)}
                        onDragEnd={(e) => {
                            const gridWidth =
                                window.innerWidth / (5 * parseInt(scale));
                            const gridHeight =
                                window.innerHeight / (10 * parseInt(scale));
                            const rectWidth = 40;
                            const rectHeight = 100;

                            let newX = e.target.x();
                            let newX1 =
                                Math.floor(newX / gridWidth) * gridWidth;
                            let newX2 =
                                Math.ceil((newX + rectWidth) / gridWidth) *
                                gridWidth;
                            console.log(newX1, newX, newX2);
                            if (
                                newX - newX1 <= newX2 - newX - rectWidth &&
                                newX - newX1 <= 10
                            ) {
                                newX = newX1;
                            } else if (newX2 - newX - rectWidth <= 10) {
                                newX = newX2 - rectWidth;
                            }

                            let newY = e.target.y();
                            let newY1 =
                                Math.floor(newY / gridHeight) * gridHeight;
                            let newY2 =
                                Math.ceil((newY + rectHeight) / gridHeight) *
                                gridHeight;

                            console.log(newY1, newY, newY2);
                            if (
                                newY - newY1 <= newY2 - newY - rectHeight &&
                                newY - newY1 <= 10
                            ) {
                                newY = newY1;
                            } else if (newY2 - newY - rectHeight <= 10) {
                                newY = newY2 - rectHeight;
                            }

                            // push new circle to view
                            // note that we must push circle first before returning draggable circle
                            // because e.target.x returns draggable circle's positions
                            const pos = {
                                x: newX,
                                y: newY,
                                id: uuid(),
                                text: "T",
                                width: 40,
                                textEditVisible: true,
                                height: 100,
                                fontSize: 50,
                                name: "text",
                                rotation: 0,
                            };
                            setShapes((prevTexts) => [...prevTexts, pos]);

                            // return draggable circle to original position
                            // notice the dot (.) before "draggableCircle"
                            var stage = stageRef.current;
                            var draggableText = stage.findOne(".draggableText");
                            draggableText.position({ x: 35, y: 160 });
                            history = history.slice(0, historyStep + 1);
                            history = history.concat([
                                { shapes: [...shapes, pos], lines: lines },
                            ]);
                            historyStep += 1;
                        }}
                    />
                    <Label
                        x={10}
                        y={210}
                        id="button1"
                        onClick={() => alert('clicked')}
                    >

                        <Tag
                            fill={'#6200ee'}

                            fontFamily={'Calibri'}
                            fontSize={18}
                            padding={5}
                            lineJoin={'round'}
                            cornerRadius={5}
                        />
                        <Text
                            align="center"
                            verticalAlign="middle"
                            text={"BUTTON"}
                            height={40}
                            width={100}
                            fontFamily={'Calibri'}
                            fontSize={18}
                            padding={10}
                            fill={'white'}
                        />
                    </Label>
                    <Label
                        x={10}
                        y={210}
                        name="draggablebutton"
                        id="button1"
                        draggable={!useTool}
                        // onClick={()=>setUseTool(false)}
                        // onTap={()=>setUseTool(false)}
                        // onDragStart={()=>setUseTool(false)}
                        onDragEnd={(e) => {
                            const gridWidth =
                                window.innerWidth / (5 * parseInt(scale));
                            const gridHeight =
                                window.innerHeight / (10 * parseInt(scale));
                            const rectWidth = 100;
                            const rectHeight = 40;

                            let newX = e.target.x();
                            let newX1 =
                                Math.floor(newX / gridWidth) * gridWidth;
                            let newX2 =
                                Math.ceil((newX + rectWidth) / gridWidth) *
                                gridWidth;
                            console.log(newX1, newX, newX2);
                            if (
                                newX - newX1 <= newX2 - newX - rectWidth &&
                                newX - newX1 <= 10
                            ) {
                                newX = newX1;
                            } else if (newX2 - newX - rectWidth <= 10) {
                                newX = newX2 - rectWidth;
                            }

                            let newY = e.target.y();
                            let newY1 =
                                Math.floor(newY / gridHeight) * gridHeight;
                            let newY2 =
                                Math.ceil((newY + rectHeight) / gridHeight) *
                                gridHeight;

                            console.log(newY1, newY, newY2);
                            if (
                                newY - newY1 <= newY2 - newY - rectHeight &&
                                newY - newY1 <= 10
                            ) {
                                newY = newY1;
                            } else if (newY2 - newY - rectHeight <= 10) {
                                newY = newY2 - rectHeight;
                            }

                            // push new circle to view
                            // note that we must push circle first before returning draggable circle
                            // because e.target.x returns draggable circle's positions
                            const pos = {
                                x: newX,
                                y: newY,
                                id: uuid(),
                                height: 40,
                                width: 100,
                                name: "button",
                                rotation: 0,
                            };
                            setShapes((prevRectangles) => [
                                ...prevRectangles,
                                pos,
                            ]);

                            // return draggable circle to original position
                            // notice the dot (.) before "draggableCircle"
                            var stage = stageRef.current;
                            var draggableButton =
                                stage.findOne(".draggablebutton");
                            draggableButton.position({ x: 10, y: 210 });
                            history = history.slice(0, historyStep + 1);
                            history = history.concat([
                                { shapes: [...shapes, pos], lines: lines },
                            ]);
                            historyStep += 1;
                        }}
                    >

                        <Tag
                            fill={'#6200ee'}

                            fontFamily={'Calibri'}
                            fontSize={18}
                            padding={5}

                            lineJoin={'round'}
                            cornerRadius={5}
                        />
                        <Text
                            align="center"
                            verticalAlign="middle"
                            text={"BUTTON"}
                            fontFamily={'Calibri'}
                            fontSize={18}
                            height={40}
                            width={100}
                            padding={10}
                            fill={'white'}
                        />
                    </Label>
                    <Html>
                        <div>
                            <input
                                type="button"
                                value="Undo"
                                onClick={handleUndo}
                            />
                            <input
                                type="button"
                                value="Redo"
                                onClick={handleRedo}
                            />
                            <input
                                type="button"
                                value="Save"
                                onClick={handleSave}
                            />
                            <br />
                            <input
                                type="button"
                                value="Pencil"
                                style={
                                    tool === "pen" && useTool
                                        ? { backgroundColor: "aqua" }
                                        : null
                                }
                                onClick={() => {
                                    setTool("pen");
                                    setUseTool(!useTool);
                                }}
                            />
                            {/* <input type="button" value="Eraser" style={tool=='eraser' && useTool?{backgroundColor: "aqua"}:null} onClick={()=>{setTool('eraser'); setUseTool(!useTool)}} /> */}
                        </div>
                        {textEdit ? (
                            <textarea
                                value={editShape.text}
                                onChange={onEdit}
                            ></textarea>
                        ) : null}
                    </Html>
                </Layer>
            </Stage>
        </>
    );
}
