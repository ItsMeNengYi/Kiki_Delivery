import cv2
import mediapipe as mp
import time

# Initialize the video capture
cap = cv2.VideoCapture(0)

# Initialize MediaPipe Face Mesh
mpDraw = mp.solutions.drawing_utils
mpFaceMesh = mp.solutions.face_mesh
faceMesh = mpFaceMesh.FaceMesh(max_num_faces=2)

# Drawing specifications
drawSpec = mpDraw.DrawingSpec(thickness=1, circle_radius=1)

# Frame rate calculation
presentTime = 0

while True:
    success, img = cap.read()
    if not success:
        print("Error: Unable to capture video")
        break
    
    imgRGB = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    results = faceMesh.process(imgRGB)
    
    if results.multi_face_landmarks:
        for faceLms in results.multi_face_landmarks:
            # Draw the face landmarks on the image
            mpDraw.draw_landmarks(
                image=img,
                landmark_list=faceLms,
                connections=mpFaceMesh.FACEMESH_TESSELATION,  # Correct attribute
                landmark_drawing_spec=drawSpec,
                connection_drawing_spec=drawSpec
            )
            for id, lm in enumerate(faceLms.landmark):
                ih, iw, ic = img.shape
                x, y = int(lm.x * iw), int(lm.y * ih)
    
    # Calculate FPS
    currentTime = time.time()
    fps_rate = 1 / (currentTime - presentTime)
    presentTime = currentTime

    # Display FPS on the image
    cv2.putText(img, f'fps: {int(fps_rate)}', (20, 70), cv2.FONT_HERSHEY_PLAIN, 3, (0, 0, 255), 3)

    # Display the image
    cv2.imshow('Face Mesh Detection', img)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()