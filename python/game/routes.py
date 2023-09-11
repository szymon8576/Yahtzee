from flask import Blueprint, jsonify, request
from .gameRoomsAccumulator import *

game_bp = Blueprint('game', __name__)

gameRooms = GameRoomAccumulator()

@game_bp.route('/join-room', methods=["POST"])
def join_room():
    result, status_code = gameRooms.join_room(int(request.form["room_id"]))
    return jsonify(result), status_code


@game_bp.route('/get-rooms-ids', methods=["GET"])
def get_rooms_ids():
    ids = [room.id for room in gameRooms.rooms]
    return jsonify(ids)

@game_bp.route('/get-room-state', methods=["GET"])
def get_room_state():
    result, status_code = gameRooms.get_room_state(int(request.form["room_id"]))
    return jsonify(result), status_code
