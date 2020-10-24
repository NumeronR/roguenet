const fs = require("fs");
const rexpaintjs = require('rexpaintjs')
const Tiles = require('./Tiles.enum');

const TILE_MAP = {};
TILE_MAP[',006600'] = Tiles.GRASS;
TILE_MAP['#CBCBCB'] = Tiles.WALL;
TILE_MAP['.CBCBCB'] = Tiles.FLOOR;
TILE_MAP['*204000'] = Tiles.BUSH;
TILE_MAP['=0080FF'] = Tiles.WATER;
TILE_MAP['@3399FF'] = Tiles.SIGN;
TILE_MAP['Ó3399FF'] = Tiles.SIGN_LEFT_WING; // ╙
TILE_MAP['½3399FF'] = Tiles.SIGN_RIGHT_WING; // ╜
TILE_MAP['É8000FF'] = Tiles.ALTAR_LEFT; // ╔
TILE_MAP['Í8000FF'] = Tiles.ALTAR_MIDDLE; // ═
TILE_MAP['»8000FF'] = Tiles.ALTAR_RIGHT; // ╗
TILE_MAP['Ò663300'] = Tiles.WOOD_BARRIER; //╥
TILE_MAP['+FB00FF'] = Tiles.WINDOW;
TILE_MAP['#B20000'] = Tiles.PORTICULIS;

module.exports = {
	loadLevel: async function(level){
		var fileBuffer = fs.readFileSync('maps/temple.xp');
		const map = await rexpaintjs.fromBuffer(fileBuffer);
		const layer = map.layers[0];
		for (var x = 0; x < layer.width; x++){
			level.map[x] = [];
			for (var y = 0; y < layer.height; y++){
				const tile = layer.raster[y * layer.width + x];
				const char = String.fromCharCode(tile.asciiCode);
				const tileKey = char + tile.fg.hex.toUpperCase();
				let tileType = TILE_MAP[tileKey];
				if (!tileType) {
					console.log("Created tile " + tileKey);
					tileType = {
						tileId: tileKey,
						character: char, // TODO: Convert to utf8
						color: [tile.fg.r, tile.fg.g, tile.fg.b],
						solid: false,
						opaque: false
					}
					Tiles[tileKey] = tileType;
					TILE_MAP[tileKey] = tileType;
				}
				level.map[x][y] = tileType;
			}
		}
	}
}