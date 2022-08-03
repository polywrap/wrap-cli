from __future__ import annotations
from dataclasses import dataclass
from abc import ABC, abstractmethod

from .query import QueryApiOptions


@dataclass
class SubscriptionFrequency:
    """Defines the frequency of API invocations for an API subscription."""

    ms: int = None
    sec: int = None
    min: int = None
    hours: int = None


@dataclass
class SubscribeOptions(QueryApiOptions):
    """Options required for an API subscription."""

    frequency: SubscriptionFrequency = None
    """The frequency of API invocations. Defaults to one query per minute."""


@dataclass
class Subscription(ABC):
    """An API subscription, which implements the AsyncIterator protocol, is an AsyncIterable that yields query results at a specified frequency."""

    frequency: int
    """The frequency of API invocations"""
    is_active: bool
    """Indicates whether the subscription is currently active"""

    @classmethod
    @abstractmethod
    def stop(cls):
        """Stops subscription.

        If a query has been called but has not yet returned, that query will be completed and its result will be yielded."""
        None

    @classmethod
    @abstractmethod
    async def async_iterator(cls):
        QueryApiResult


class SubscriptionHandler(ABC):
    @classmethod
    @abstractmethod
    def subscribe(cls, options: SubscribeOptions):
        Subscription
