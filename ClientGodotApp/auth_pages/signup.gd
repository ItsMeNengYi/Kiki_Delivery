extends Control


# Called when the node enters the scene tree for the first time.
func _ready():
	Firebase.Auth.signup_succeeded.connect(on_signup_succeeded)
	Firebase.Auth.signup_failed.connect(on_signup_failed)
	pass # Replace with function body.

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass
	
func on_signup_succeeded(auth):
	print(auth)
	Firebase.Auth.save_auth(auth)
	Firebase.Auth.send_account_verification_email()
	$StateLabel.text = "Verification email sent. Verify email before logging in."
	pass

func on_signup_failed(error_code, message):
	print(error_code)
	print(message)
	$StateLabel.text = "Signup failed. Error: %s" % message
	pass

func _on_sign_up_button_pressed():
	if $PasswordLineEdit.text == $PasswordLineEdit2.text:
		var email = $EmailLineEdit.text
		var password = $PasswordLineEdit.text
		Firebase.Auth.signup_with_email_and_password(email, password)
		$StateLabel.text = "Signing up..."
	pass # Replace with function body.

func _on_return_button_pressed():
	get_tree().change_scene_to_file("res://auth_pages/authentication.tscn")
	pass # Replace with function body.
