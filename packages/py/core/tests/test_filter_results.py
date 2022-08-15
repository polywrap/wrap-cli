import pytest

from .. import filter_results


def test_working_filter_results():
    result = {"rootA": {"prop1": "hey", "prop2": "heyu"}, "rootB": {"prop3": 5, "prop4": {"deep": 1.5}}}
    filter = {"rootA": {"prop1": True}, "rootB": True}

    assert filter_results(result, filter) == {
        "rootA": {"prop1": "hey"},
        "rootB": {"prop3": 5, "prop4": {"deep": 1.5}},
    }


def test_error_filter_value_property():
    expected = "The result given is not a dict"
    with pytest.raises(ValueError, match=expected):
        result = {"rootA": {"prop1": "hey", "prop2": "heyu"}}
        filter = {"rootA": {"prop1": {}}}
        filter_results(result, filter)


def test_error_filter_value():
    expected = "The result given is not a dict"
    with pytest.raises(ValueError, match=expected):
        result = 5
        filter = {"rootA": True}
        filter_results(result, filter)


def test_error_filter_not_there():
    with pytest.raises(Exception):
        result = {"rootA": {"prop1": "hey"}}
        filter = {"rootA": {"prop3": True}}

        filter_results(result, filter) == {"rootA": {"prop3": None}}


def test_returns_null_if_null_result():
    filter = {"rootA": True}

    assert filter_results(None, filter) is None
