from rest_framework.decorators import api_view
from django.shortcuts import HttpResponse
from rest_framework import status
from django.forms.models import model_to_dict
from django.core.exceptions import ObjectDoesNotExist
from app.models import Geolocation
import json
import datetime


def serialize_geolocation(geolocation):
    serialized = model_to_dict(geolocation)
    serialized["date"] = str(geolocation.date)
    serialized["name"] = str(geolocation.name)
    serialized["latitude"] = float(geolocation.latitude)
    serialized["longitude"] = float(geolocation.longitude)
    return serialized


def save_geolocation(request, geolocation, success_status):
    errors = []
    name = request.data.get("name", "")
    if name == "":
        errors.append({"item": "This field is required"})

    try:
        latitude = request.data.get("latitude", "")
        longitude = request.data.get("longitude", "")
        if latitude == "":
            errors.append({"latitude": "This field is required"})
        if longitude == "":
            errors.append({"longitude": "This field is required"})
    except ValueError:
        errors.append({"latitude/longitude": "Could not parse field"})

    date = request.data.get("date", "")
    if date == "":
        date = datetime.datetime.now()

    if len(errors) > 0:
        return HttpResponse(json.dumps(
            {
                "errors": errors
            }), status=status.HTTP_400_BAD_REQUEST)

    try:
        geolocation.date = date
        geolocation.name = name
        geolocation.latitude = latitude
        geolocation.longitude = longitude
        geolocation.save()
    except Exception as e:
        return HttpResponse(json.dumps(
            {
                "errors": {"geolocation": str(e)}
            }), status=status.HTTP_400_BAD_REQUEST)

    return HttpResponse(json.dumps({"data": serialize_geolocation(geolocation)}), status=success_status)


@api_view(['GET', 'POST'])
def geolocations(request):
    if request.user.is_anonymous:
        return HttpResponse(json.dumps({"detail": "Not authorized"}), status=status.HTTP_401_UNAUTHORIZED)

    if request.method == "GET":
        geolocation_data = Geolocation.objects.all()

        geolocation_data_count = geolocation_data.count()

        page_size = int(request.GET.get("page_size", "10"))
        page_no = int(request.GET.get("page_no", "0"))
        geolocation_data = list(geolocation_data[page_no * page_size:page_no * page_size + page_size])

        geolocation_data_final = [serialize_geolocation(geolocation) for geolocation in geolocation_data]
        return HttpResponse(json.dumps({"count": geolocation_data_count, "data": geolocation_data_final}), status=status.HTTP_200_OK)

    if request.method == "POST":
        geolocation = Geolocation()
        return save_geolocation(request, geolocation, status.HTTP_201_CREATED)

    return HttpResponse(json.dumps({"detail": "Wrong method"}), status=status.HTTP_501_NOT_IMPLEMENTED)


@api_view(['GET', 'PUT', 'DELETE'])
def geolocation(request, geolocation_id):
    if request.user.is_anonymous:
        return HttpResponse(json.dumps({"detail": "Not authorized"}), status=status.HTTP_401_UNAUTHORIZED)

    try:
        geolocation = Geolocation.objects.get(pk=geolocation_id)
    except ObjectDoesNotExist:
        return HttpResponse(json.dumps({"detail": "Not found"}), status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        return HttpResponse(json.dumps({"data": serialize_geolocation(geolocation)}), status=status.HTTP_200_OK)

    if request.method == "PUT":
        return save_geolocation(request, geolocation, status.HTTP_200_OK)

    if request.method == "DELETE":
        geolocation.delete()
        return HttpResponse(json.dumps({"detail": "deleted"}), status=status.HTTP_410_GONE)

    return HttpResponse(json.dumps({"detail": "Wrong method"}), status=status.HTTP_501_NOT_IMPLEMENTED)
