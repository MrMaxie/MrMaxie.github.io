I developed the guidance and landing-trajectory layer for an <mark>autonomous drone</mark>. The wider system used a custom YOLO model to recognize the landing target, while this layer turned the latest target position and flight data into continuous movement corrections.

## Closed-loop PID guidance

The drone did not follow a route calculated only once. Its guidance used a **closed-loop PID control architecture**: new observations updated the target position, and the PID controllers recalculated the required response many times per second.

- **Target estimation:** combine camera observations, orientation and height data to locate the target relative to the drone.
- **Orientation control:** use PID feedback to keep the drone facing the target before moving towards it.
- **Flight correction:** coordinate PID controllers for yaw, roll, pitch and thrust using the latest flight feedback.

## Real-time simulation

I tested the flight process in <mark>Gazebo Classic</mark>, using PX4 SITL as the simulated autopilot. ROS connected the project nodes, while MAVROS carried commands and telemetry between the guidance software and the virtual drone. This setup rendered the drone in real time and made it possible to observe, tune and repeat the complete guidance sequence without a physical aircraft.

## How I built it

I developed the C++ ROS nodes responsible for target-position estimation, coordinate transformations and the <mark>PID controllers</mark> for height, orientation and velocity. I connected them to PX4's offboard-control path, assembled the Gazebo launch environment and iterated on the controller behavior through repeated real-time simulations.
