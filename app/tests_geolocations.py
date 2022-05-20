from django.test import TestCase
from django.contrib.auth.models import User
import json

test_user = {"username": "testuser", "password": "testpassword"}


class GeolocationTest(TestCase):
    def setUp(self):
        new_user = User.objects.create(username=test_user["username"])
        new_user.set_password(test_user["password"])
        new_user.save()

    def get_token(self):
        res = self.client.post('/api/token/',
                               data=json.dumps({
                                   'username': test_user["username"],
                                   'password': test_user["password"],
                               }),
                               content_type='application/json',
                               )
        result = json.loads(res.content)
        self.assertTrue("access" in result)
        return result["access"]



    def test_add_geolocations_ok(self):
        token = self.get_token()
        res = self.client.post('/api/geolocations/',
                               data=json.dumps({
                                   'name': "Kishoreganj",
                                   'latitude': 24.403490,
                                   'longitude': 90.772301
                               }),
                               content_type='application/json',
                               HTTP_AUTHORIZATION=f'Bearer {token}'
                               )
        self.assertEquals(res.status_code, 201)
        result = json.loads(res.content)["data"]
        self.assertEquals(result["item"], 'Kishoreganj')
        self.assertEquals(result["latitude"], 24.403490)
        self.assertEquals(result["longitude"], 90.772301)



    #  -------------------------- GET RECORDS -------------------------------------------

    def test_get_geolocations(self):
        token = self.get_token()
        res = self.client.post('/api/geolocations/',
                               data=json.dumps({
                                   'name': "Jhenaidah",
                                   'latitude': 23.633841,
                                   'longitude': 89.066856
                               }),
                               content_type='application/json',
                               HTTP_AUTHORIZATION=f'Bearer {token}'
                               )
        self.assertEquals(res.status_code, 201)
        id1 = json.loads(res.content)["data"]["id"]

        res = self.client.post('/api/geolocations/',
                               data=json.dumps({
                                   'name': "Kishoreganj",
                                   'latitude': 24.403490,
                                   'longitude': 90.772301
                               }),
                               content_type='application/json',
                               HTTP_AUTHORIZATION=f'Bearer {token}'
                               )
        self.assertEquals(res.status_code, 201)
        id2 = json.loads(res.content)["data"]["id"]

        res = self.client.get('/api/geolocations/',
                              content_type='application/json',
                              HTTP_AUTHORIZATION=f'Bearer {token}'
                              )

        self.assertEquals(res.status_code, 200)
        result = json.loads(res.content)["data"]
        self.assertEquals(len(result), 2)  # 2 records
        self.assertTrue(result[0]["id"] == id1 or result[1]["id"] == id1)
        self.assertTrue(result[0]["id"] == id2 or result[1]["id"] == id2)

        res = self.client.get(f'/api/geolocations/{id1}/',
                              content_type='application/json',
                              HTTP_AUTHORIZATION=f'Bearer {token}'
                              )
        self.assertEquals(res.status_code, 200)
        result = json.loads(res.content)["data"]
        self.assertEquals(result["name"], 'Jhenaidah')
        self.assertEquals(result["latitude"], 23.633841)
        self.assertEquals(result["longitude"], 89.066856)


