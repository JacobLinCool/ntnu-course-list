# ntnu-course-list-data

Developer Friendly Course List of National Taiwan Normal University. The data.

## Versioning

Since the course list can be seen as immutable, I use the following versioning scheme:

```
<schema version>.<year><term>.<revision>
```

For example, if you want to use the course list of `112` academic year, `1`st term. The semantic version range can be `~1.1121.0`.

## Usage

It is not recommended to use this package directly. Access the data through a CDN instead.

For example, if you want to use the course list of `112` academic year, `1`st term. You can use the following URL:

```
https://esm.sh/ntnu-course-list-data@1.1121/all.json
```

Other files are also available:

- `all.json`: All of the data, with parsed weekday-period-location-classroom information.
- `raw.json`: All of the data, w/o parsed weekday-period-location-classroom information.
- `depts.json`: All of the departments, which can be used to get `<dept>/all.json`.
- `<dept>/all.json`: All of the courses of the department, with parsed weekday-period-location-classroom information.

## Data Source and License

All of the data are from <https://courseap2.itc.ntnu.edu.tw/acadmOpenCourse>, National Taiwan Normal University owns the copyright.
