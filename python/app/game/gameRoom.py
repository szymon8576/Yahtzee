import random
from datetime import datetime

categories = ['twos', 'fours', 'fullhouse', 'threes', 'fives',
              'largestraight', 'chance', 'yahtzee', 'sixes', 'ones', 'smallstraight', 'threeofakind', 'fourofakind']

player_cells = [c+"-1" for c in categories] + [c+"-2" for c in categories]


def get_random_dices():
    return [random.randint(1, 6) for _ in range(5)]


class GameRoom:
    def __init__(self, room_id):
        self.id = room_id
        self.player1, self.player2 = None, None
        self.locked_scores = {"1": {}, "2": {}}
        self.rolled_dices, self.marked_dices = get_random_dices(), []
        self.last_time_joined = datetime(2000, 1, 1, 0, 0, 0)
        self.current_player = 1

    def get_state(self):
        return {
            "room_id": self.id,
            "players_ids": [self.player1 if self.player1 is not None else None,
                            self.player2 if self.player2 is not None else None],
            "current_player": self.current_player,
            # "scores": self.scores,
            "lockedDices": self.marked_dices,
            "rolledDices": self.rolled_dices,
            "scoreFields": self.locked_scores,
            "last_time_joined": str(self.last_time_joined),
            "end_of_game": self.check_if_game_end()
        }

    def check_if_game_end(self):
        if len(self.locked_scores) and len(self.locked_scores["1"]) == 13 and len(self.locked_scores["2"]) == 13 :
            self.reset_table()
            return True
        else:
            return False

    def reset_table(self):
        self.player1, self.player2 = None, None
        self.locked_scores = {"1": {}, "2": {}}
        self.rolled_dices, self.marked_dices = get_random_dices(), []
        self.last_time_joined = datetime(2000, 1, 1, 0, 0, 0)
        self.current_player = 1

    def update_state(self, new_state):

        self.marked_dices = new_state["lockedDices"]
        self.rolled_dices = new_state["rolledDices"]
        self.locked_scores = new_state["scoreFields"]

        if new_state["player_change"]:

            self.rolled_dices = get_random_dices()
            self.marked_dices = []

            if self.current_player == 1:
                self.current_player = 2
            else:
                self.current_player = 1

    @property
    def is_active(self):
        return (datetime.now() - self.last_time_joined).seconds < 18_000
