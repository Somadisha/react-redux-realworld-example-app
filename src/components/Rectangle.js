import React from 'react'
import {
    Rect,
    Transformer
} from 'react-konva'
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

export default Rectangle