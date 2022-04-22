/*
 * @Author: JackFly
 * @since: 2021-09-15 14:26:49
 * @lastTime: 2021-10-26 14:22:53
 * @文件相对于项目的路径: /TrunkFace/src/components/Map/model/MapStyle.js
 * @LastAuthor: Do not edit
 * @message:
 */

export const MapStyle = (theme) => {
    const common = {
        Polygon: {
            Yard: {
                lineWidth: 0,
                polygonFill: 'red',
                polygonOpacity: 0,
            },
            Epile: {
                lineWidth: 0,
                polygonFill: '#4CFFB0',
                polygonOpacity: 0,
            },
            Ebox: {
                lineWidth: 0,
                polygonFill: '#00F0E1',
                polygonOpacity: 0,
            },
            Arrow: {
                lineWidth: 0,
                polygonFill: '#B1D0FF',
                polygonOpacity: 0.8,
            },
            Lock: {
                lineWidth: 1,
                polygonFill: '#FFDE10',
                polygonOpacity: 0.8,
            },
            Buffer: {
                lineWidth: 0,
                polygonFill: '#46B4FF',
                polygonOpacity: 0.8,
            },
            Seaside: {
                lineWidth: 0,
                polygonFill: 'green',
                polygonOpacity: 0,
            },
            Hatch: {
                lineWidth: 0,
                polygonFill: '#5A6986',
                polygonOpacity: 0.8,
            },
            Charge: {
                lineWidth: 0,
                polygonFill: '#2A458F',
                polygonOpacity: 0,
            },
            Road: {
                lineWidth: 1,
                polygonFill: 'black',
                polygonOpacity: 0,
                lineColor: '#00A1FF',
            },
        },
    };
    const styles = {
        blue: {
            Point: {
                0: {
                    textFaceName: 'sans-serif',
                    textFill: '#B1D0FF',
                    textHorizontalAlignment: 'center',
                    textSize: 8,
                },
                1: {
                    textFaceName: 'sans-serif',
                    textFill: '#B1D0FF',
                    textHorizontalAlignment: 'center',
                    textSize: 8,
                },
            },
            LineString: {
                0: {
                    lineColor: '#00A1FF',
                    lineWidth: 1,
                },
                1: {
                    lineColor: '#B1D0FF',
                    lineOpacity: 0.5,
                    lineDasharray: [0, 15, 0], //dasharray, e.g. [10, 5, 5]
                    lineWidth: 1,
                },
                2: {
                    lineColor: '#B1D0FF',
                    lineWidth: 2,
                },
                3: {
                    lineColor: '#2A458F',
                    lineWidth: 0,
                },
                4: {
                    lineColor: '#00A1FF',
                    lineWidth: 1,
                },
            },
            Polygon: {
                ...common.Polygon,
                Yard: {
                    lineWidth: 0,
                    polygonFill: '#5A7EBD',
                    polygonOpacity: 0.8,
                },
                Arrow: {
                    lineWidth: 0,
                    polygonFill: '#B1D0FF',
                    polygonOpacity: 0.8,
                },
            },
        },
        black: {
            Point: {
                0: {
                    textFaceName: 'sans-serif',
                    textFill: '#D6E0E5',
                    textHorizontalAlignment: 'center',
                    textSize: {
                        stops: [
                            [7, 9],
                            [12, 25],
                        ],
                    },
                },
                1: {
                    textFaceName: 'sans-serif',
                    textFill: '#D6E0E5',
                    textHorizontalAlignment: 'center',
                    textSize: {
                        stops: [
                            [7, 9],
                            [12, 25],
                        ],
                    },
                },
            },
            LineString: {
                0: {
                    lineColor: '#737474',
                    lineWidth: 1,
                },
                1: {
                    lineColor: '#969696',
                    lineOpacity: 0.5,
                    lineDasharray: [0, 15, 0], //dasharray, e.g. [10, 5, 5]
                    lineWidth: 1,
                },
                2: {
                    lineColor: '#969696',
                    lineWidth: 2,
                },
                3: {
                    lineColor: '#2A458F',
                    lineWidth: 0,
                },
                4: {
                    lineColor: '#737474',
                    lineWidth: 1,
                },
            },
            Polygon: {
                ...common.Polygon,
                Yard: {
                    lineWidth: 0,
                    polygonFill: '#3C3E46',
                    polygonOpacity: 0.8,
                },
                Arrow: {
                    lineWidth: 0,
                    polygonFill: '#969696',
                    polygonOpacity: 0.8,
                },
            },
        },
        white: {
            Point: {
                0: {
                    textFaceName: 'sans-serif',
                    textFill: '#6B757B',
                    textHorizontalAlignment: 'center',
                    textSize: {
                        stops: [
                            [7, 9],
                            [12, 25],
                        ],
                    },
                },
                1: {
                    textFaceName: 'sans-serif',
                    textFill: '#6B757B',
                    textHorizontalAlignment: 'center',
                    textSize: {
                        stops: [
                            [7, 9],
                            [12, 25],
                        ],
                    },
                },
            },
            LineString: {
                0: {
                    lineColor: '#909597',
                    lineWidth: 1,
                },
                1: {
                    lineColor: '#C4CACD',
                    lineOpacity: 0.5,
                    lineDasharray: [0, 15, 0], //dasharray, e.g. [10, 5, 5]
                    lineWidth: 1,
                },
                2: {
                    lineColor: '#C4CACD',
                    lineWidth: 2,
                },
                3: {
                    lineColor: '#2A458F',
                    lineWidth: 0,
                },
                4: {
                    lineColor: '#909597',
                    lineWidth: 1,
                },
            },
            Polygon: {
                ...common.Polygon,
                Yard: {
                    lineWidth: 0,
                    polygonFill: '#CFDCE7',
                    polygonOpacity: 0.8,
                },
                Arrow: {
                    lineWidth: 0,
                    polygonFill: '#C4CACD',
                    polygonOpacity: 0.8,
                },
            },
        },
    };
    return {
        ...(styles[theme] || styles.blue),
    };
};
