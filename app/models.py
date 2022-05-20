from django.db import models


class Geolocation(models.Model):
    date = models.DateField(blank=False)
    name = models.CharField(max_length=100, blank=False)
    latitude = models.DecimalField(decimal_places=2, max_digits=10, default=0)
    longitude = models.DecimalField(decimal_places=2, max_digits=10, default=0)

    def __str__(self):
        return f"{self.date}: {self.name}"

    class Meta:
        ordering = ["-id"]

