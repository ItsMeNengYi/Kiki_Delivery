extends Control


# Called when the node enters the scene tree for the first time.
func _ready():
	check_data()
	pass # Replace with function body.

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass

func check_data():
	var auth = Firebase.Auth.auth
	if auth.localid:
		var firestore_collection: FirestoreCollection = Firebase.Firestore.collection("game_data")
		var task: FirestoreTask  = firestore_collection.get_doc(auth.localid)
		# connect signal to function
		firestore_collection.get_document.connect(on_document_get)
		firestore_collection.error.connect(on_document_error)
		# test retrieval of data
		var finished_task: FirestoreTask = await task.task_finished ##async task
	pass

func on_document_get():
	$StateLabel.text = "Game data found.  Redirecting..."
	get_tree().change_scene_to_file("res://game_map/game_map.tscn")
	
func on_document_error(error_code, error_status, error_message):
	$StateLabel.text = "No game data found.  Redirecting..."
	await get_tree().create_timer(1).timeout
	get_tree().change_scene_to_file("res://first_time_player/first_time_player_game_data.tscn")
	pass
