import React, { useEffect } from 'react';

const KakaoMap = () => {
  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      const mapContainer = document.getElementById('map');
      const mapOption = {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
        level: 3,
      };
      
      const map = new window.kakao.maps.Map(mapContainer, mapOption);
      
      const marker = new window.kakao.maps.Marker({
        position: map.getCenter(),
      });
      
      marker.setMap(map);

      const handleMapClick = function(mouseEvent) {        
        const latlng = mouseEvent.latLng;
        marker.setPosition(latlng);
        
        
        const message = `클릭한 위치의 위도는 ${latlng.getLat()} 이고, 경도는 ${latlng.getLng()} 입니다`;
        
        const resultDiv = document.getElementById('clickLatlng'); 
        resultDiv.innerHTML = message;


        const sendLocationToServer = (latitude, longitude) => {
            const locationData = {
              latitude,
              longitude
            };
           


              
        
            fetch('https://port-0-m22tup-back-3prof2lllf7r2ko.sel3.cloudtype.app/reveiveLocation', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(locationData)
            })
              .then(response => response.json())
              .then(data => {
                console.log('Location data sent and saved:', data);
              })
              .catch(error => {
                console.error('Error sending location data:', error);
              });
          };

          


        // 클릭한 위치의 위도와 경도를 JSON 데이터로 출력
        const jsonMessage = JSON.stringify({ latitude: latlng.getLat(), longitude: latlng.getLng() });
        const jsonDiv = document.getElementById('jsonOutput'); 
        jsonDiv.innerHTML = `클릭한 위치 정보(JSON): ${jsonMessage}`;
      };

      // 사용자 동의를 받고 위치 정보 가져오기
      const getLocation = function() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;
              const currentPositionLatLng = new window.kakao.maps.LatLng(lat, lng);
              map.setCenter(currentPositionLatLng);
              marker.setPosition(currentPositionLatLng);
            },
            (error) => {
              console.error('Error getting GPS position:', error);
            }
          );
        } else {
          console.error('Geolocation is not supported by this browser.');
        }
      };

      // 사용자 동의 얻기
      if (window.confirm('내 위치를 가져와 지도 중앙에 표시하시겠습니까?')) {
        getLocation();
      }

      // 지도 클릭 이벤트 리스너 등록
      window.kakao.maps.event.addListener(map, 'click', handleMapClick);
    }
  }, []);

  return (
    <div>
      <div id="map" style={{textAlign:'center', width: '350px', height: '350px' }}></div>
      <p><em>지도를 클릭해주세요!</em></p>
      <div id="clickLatlng"></div>
      <div id="jsonOutput"></div>
    </div>
  );
};

export default KakaoMap;
