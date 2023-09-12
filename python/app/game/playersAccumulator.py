from random import choice
from .player import *


class PlayersAccumulator:
    def __init__(self):
        self.players = []

    def create_player(self):
        player_id = Player(player_id = self.generate_id())
        self.players.append(player_id)
        return player_id

    def generate_id(self):
        taken_ids = self.get_players_ids()

        generated_id = None

        while generated_id is None or generated_id in taken_ids:
            generated_id = choice(adjectives) + "_" + choice(animals)

        return generated_id

    def get_players_ids(self):
        return [player.id for player in self.players]