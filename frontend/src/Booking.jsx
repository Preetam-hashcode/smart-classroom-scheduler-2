import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./App.css";

const NUM_BUILDINGS = 5;
const NUM_FLOORS = 2;
const NUM_ROOMS = 5;

// Helper function to format room numbers as A001, A002, ...
const formatRoomNumber = (id) => `${id.toString().padStart(3, '0')}`;

const buildInitialRooms = () => {
  const rooms = [];
  let id = 1;
  const statusOptions = ["available", "booked", "soon"];
  const bookedByTeachers = [
    "Prof. Smith",
    "Prof. Lee",
    "Dr. Jones",
    "Dr. Patel",
    "Prof. Gupta",
  ];
  const endTimes = ["14:30", "15:45", "16:00", "17:00", "18:00"];
  for (let b = 1; b <= NUM_BUILDINGS; b++) {
    for (let f = 1; f <= NUM_FLOORS; f++) {
      for (let r = 1; r <= NUM_ROOMS; r++) {
        let status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
        if (status === "booked") {
          rooms.push({
            id: id++,
            building: b,
            floor: f,
            name: `B${b}F${f}R${r}`,
            status: "booked",
            bookedBy: bookedByTeachers[Math.floor(Math.random() * bookedByTeachers.length)],
            endTime: endTimes[Math.floor(Math.random() * endTimes.length)],
            availableIn: null,
          });
        } else if (status === "soon") {
          rooms.push({
            id: id++,
            building: b,
            floor: f,
            name: `B${b}F${f}R${r}`,
            status: "soon",
            bookedBy: bookedByTeachers[Math.floor(Math.random() * bookedByTeachers.length)],
            endTime: null,
            availableIn: Math.floor(Math.random() * 3) + 1,
          });
        } else {
          rooms.push({
            id: id++,
            building: b,
            floor: f,
            name: `B${b}F${f}R${r}`,
            status: "available",
            bookedBy: null,
            endTime: null,
            availableIn: null,
          });
        }
      }
    }
  }
  return rooms;
};

function BookingModal({ room, action, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{action === "book" ? "Confirm Booking" : "Confirm Cancellation"}</h3>
        <p>
          {action === "book"
            ? `Do you want to book ${formatRoomNumber(room.id)}?`
            : `Do you want to cancel booking for ${formatRoomNumber(room.id)}?`}
        </p>
        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onCancel}>
            {action === "book" ? "Cancel" : "No"}
          </button>
          <button className="confirm-btn" onClick={onConfirm}>
            {action === "book" ? "Confirm" : "Yes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function RoomBox({ room, userRole, onRoomAction }) {
  const [popoverVisible, setPopoverVisible] = React.useState(false);
  const isTeacher = userRole === "teacher";
  let boxClass = "room-box";
  if (room.status === "available") boxClass += " available";
  else if (room.status === "booked") boxClass += " booked";
  else if (room.status === "soon") boxClass += " soon";
  React.useEffect(() => {
    function handleClickOutside(e) {
      if (!e.target.closest(`#room-${room.id}`)) setPopoverVisible(false);
    }
    if (popoverVisible) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [popoverVisible, room.id]);
  return (
    <div
      id={`room-${room.id}`}
      className={boxClass}
      onClick={() => setPopoverVisible((v) => !v)}
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && setPopoverVisible((v) => !v)}
      role="button"
      aria-haspopup="true"
      aria-expanded={popoverVisible}
      style={{ position: "relative" }}
      title={formatRoomNumber(room.id)}
    >
      <div className="room-name">{formatRoomNumber(room.id)}</div>
      {popoverVisible && (
        <div
          className="room-popover"
          style={{ pointerEvents: "auto" }}
          onClick={(e) => e.stopPropagation()}
        >
          {room.status === "available" && userRole === "student" && <div>✅ Available</div>}
          {(room.status === "booked" || room.status === "soon") && (
            <>
              <div>
                <strong>Teacher:</strong> {room.bookedBy || "N/A"}
              </div>
              <div>
                <strong>{room.status === "booked" ? "Free at:" : "Available in:"}</strong>{" "}
                {room.status === "booked" ? room.endTime || "N/A" : `${room.availableIn || "N/A"}h`}
              </div>
              {isTeacher && (
                <button
                  className="action-btn cancel"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRoomAction("cancel", room);
                    setPopoverVisible(false);
                  }}
                >
                  Cancel Booking
                </button>
              )}
            </>
          )}
          {room.status === "available" && isTeacher && (
            <button
              className="action-btn"
              onClick={(e) => {
                e.stopPropagation();
                onRoomAction("book", room);
                setPopoverVisible(false);
              }}
            >
              Book Room
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Floor({ floorNumber, rooms, userRole, onRoomAction }) {
  return (
    <div className="floor">
      <div className="floor-label">Floor {floorNumber}</div>
      <div className="rooms-row">
        {rooms.map((room) => (
          <RoomBox
            key={room.id}
            room={room}
            userRole={userRole}
            onRoomAction={onRoomAction}
          />
        ))}
      </div>
    </div>
  );
}

function Building({ buildingNumber, rooms, userRole, onRoomAction }) {
  const floors = [];
  for (let f = 1; f <= NUM_FLOORS; f++) {
    const floorRooms = rooms.filter((r) => r.floor === f);
    floors.push(
      <Floor
        key={f}
        floorNumber={f}
        rooms={floorRooms}
        userRole={userRole}
        onRoomAction={onRoomAction}
      />
    );
  }
  return (
    <div className="building">
      <div className="building-label">Building {buildingNumber}</div>
      {floors}
    </div>
  );
}

export default function Booking() {
  // Get user info (after login) from router state (reload protection: student fallback)
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user || { username: "Unknown", role: "student" };

  const [rooms, setRooms] = useState(buildInitialRooms());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [action, setAction] = useState("");
  const [buildingFilter, setBuildingFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");

  const timeSlots = [
    "all",
    "7-8",
    "9-10",
    "10-11",
    "11-12",
    "12-13",
    "13-14",
    "14-15",
    "15-16",
    "16-17",
    "17-18",
    "19-20",
  ];

  function parseEndTimeToHour(endTime) {
    if (!endTime) return null;
    return parseInt(endTime.split(":")[0], 10);
  }

  const handleRoomAction = (actionType, room) => {
    if (user.role !== "teacher") return;
    setSelectedRoom(room);
    setAction(actionType);
    setModalVisible(true);
  };

  const confirmAction = () => {
    if (!selectedRoom) return;
    if (action === "book") {
      setRooms((prev) =>
        prev.map((room) =>
          room.id === selectedRoom.id
            ? {
                ...room,
                status: "booked",
                bookedBy: user.username,
                endTime: "18:00",
                availableIn: null,
              }
            : room
        )
      );
      alert(`Classroom ${formatRoomNumber(selectedRoom.id)} booked successfully!`);
    } else if (action === "cancel") {
      setRooms((prev) =>
        prev.map((room) =>
          room.id === selectedRoom.id
            ? {
                ...room,
                status: "available",
                bookedBy: null,
                endTime: null,
                availableIn: null,
              }
            : room
        )
      );
      alert(`Booking for classroom ${formatRoomNumber(selectedRoom.id)} canceled.`);
    }
    setModalVisible(false);
    setSelectedRoom(null);
    setAction("");
  };

  const cancelModal = () => {
    setModalVisible(false);
    setSelectedRoom(null);
    setAction("");
  };

  const filteredByBuilding =
    buildingFilter === "all"
      ? rooms
      : rooms.filter((r) => r.building === parseInt(buildingFilter, 10));

  const filteredRooms = filteredByBuilding.filter((room) => {
    if (timeFilter === "all") return true;
    if (room.status === "available") return true;
    if (room.status === "booked") {
      const hour = parseEndTimeToHour(room.endTime);
      const [start, end] = timeFilter.split("-").map(Number);
      return hour >= start && hour < end;
    }
    if (room.status === "soon") return true;
    return false;
  });

  const buildings = [];
  for (let b = 1; b <= NUM_BUILDINGS; b++) {
    const buildingRooms = filteredRooms.filter((r) => r.building === b);
    if (buildingRooms.length > 0) {
      buildings.push(
        <Building
          key={b}
          buildingNumber={b}
          rooms={buildingRooms}
          userRole={user.role}
          onRoomAction={handleRoomAction}
        />
      );
    }
  }

  // Logout
  function logout() {
    navigate("/");
  }

  return (
    <div className="app-container">
      <button
        onClick={logout}
        style={{
          position: "absolute",
          top: 22,
          right: 30,
          padding: "8px 22px",
          background: "#E84949",
          color: "#fff",
          fontWeight: "600",
          border: "none",
          borderRadius: "8px",
          boxShadow: "0 2px 8px #0002",
          cursor: "pointer",
          zIndex: 10,
        }}
      >
        Logout
      </button>
      <header className="header">
        <h1 className="header-title">Classroom Booking System</h1>
        <p className="welcome-text">
          Welcome, <strong className="username">{user.username}</strong>
          <span className="wave-emoji" role="img" aria-label="waving hand">
            👋
          </span>
        </p>
      </header>
      <section className="filters">
        <label>
          Building:
          <select value={buildingFilter} onChange={(e) => setBuildingFilter(e.target.value)}>
            <option value="all">All</option>
            {[...Array(NUM_BUILDINGS)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Building {i + 1}
              </option>
            ))}
          </select>
        </label>
        <label>
          Time:
          <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot === "all" ? "All" : slot.replace("-", ":00-") + ":00"}
              </option>
            ))}
          </select>
        </label>
      </section>
      <div className="buildings-container">{buildings}</div>
      {modalVisible && selectedRoom && (
        <BookingModal
          room={selectedRoom}
          action={action}
          onConfirm={confirmAction}
          onCancel={cancelModal}
        />
      )}
    </div>
  );
}
