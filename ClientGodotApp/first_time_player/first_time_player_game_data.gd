extends Control


# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass
	
func save_game_data(name, gender):
	$StateLabel.text = "Saving game data..."
	var auth = Firebase.Auth.auth
	if auth.localid:
		var firestore_collection: FirestoreCollection = Firebase.Firestore.collection("game_data")
		# connect error/success signals
		firestore_collection.add_document.connect(on_save_success)
		firestore_collection.update_document.connect(on_save_success)
		firestore_collection.error.connect(on_save_error)
		var data_to_save: Dictionary = {
			"name": name,
			"gender": gender,
			"money": 0,
			"gold": 0,
			"items": {},
			"characters": {},
			"position": "home"
		}
		var task: FirestoreTask  = firestore_collection.update(auth.localid, data_to_save)
		var document = await task.task_finished
		print(document)
		$StateLabel.text = "Game data saved!"
		get_tree().change_scene_to_file("res://game_map/game_map.tscn")

func on_save_success():
	$StateLabel.text = "Game data saved!"
	pass
	
func on_save_error():
	$StateLabel.text = "Game data saving failed, please check internet connection"
	pass

func _on_set_username_button_pressed():
	$StateLabel.text = "Saving..."
	
	# check username formatting
	if $NameLineEdit.text.replace(" ", "") == "":
		$StateLabel.text = "Name cannot be empty"
		return
		
	# check gender selection
	if $GenderOptionButton.selected == -1:
		$StateLabel.text = "Please choose a form first"
		return
	
	var name: String = $NameLineEdit.text
	var gender: int =$GenderOptionButton.selected
	save_game_data(name, gender)
